/**
 * Cypher query string to save sensor data and its interpretation in a Neo4j database.
 *
 * This query performs the following operations:
 * - Merges (creates if not exists) a User node with the given username.
 * - Merges a Farm node with the given farm name and associates it with the user via an OWNS relationship.
 * - Merges a Sensor node with the given sensorId and associates it with the farm via a HAS_SENSOR relationship.
 * - Creates a Reading node with various sensor data properties (fertility, moisture, ph, temperature, sunlight, humidity, cropType, username, createdAt).
 * - Creates an Interpretation node with the provided interpretation value.
 * - Links the Sensor node to the Reading node via a HAS_READING relationship.
 * - Links the Reading node to the Interpretation node via an INTERPRETED_AS relationship.
 *
 * @constant
 * @type {string}
 * @see {@link https://neo4j.com/docs/cypher-manual/current/} for Cypher query language reference.
 * @param {string} $username - The username of the user.
 * @param {string} $farmName - The name of the farm.
 * @param {string} $sensorId - The unique identifier for the sensor.
 * @param {number} $fertility - The fertility value from the sensor.
 * @param {number} $moisture - The moisture value from the sensor.
 * @param {number} $ph - The pH value from the sensor.
 * @param {number} $temperature - The temperature value from the sensor.
 * @param {number} $sunlight - The sunlight value from the sensor.
 * @param {number} $humidity - The humidity value from the sensor.
 * @param {string} $cropType - The type of crop associated with the reading.
 * @param {string} $createdAt - The timestamp when the reading was created.
 * @param {string} $interpretation - The interpretation of the reading.
 */
export const saveSensorDataCypher =                     `
    MERGE (u:User {username: $username})

    MERGE (f:Farm {name: $farmName})
    MERGE (u)-[:OWNS]->(f)

    MERGE (s:Sensor {sensorId: $sensorId})
    MERGE (f)-[:HAS_SENSOR]->(s)

    CREATE (r:Reading {
        fertility: $fertility,
        moisture: $moisture,
        ph: $ph,
        temperature: $temperature,
        sunlight: $sunlight,
        humidity: $humidity,
        cropType: $cropType,
        username: $username,
        createdAt: $createdAt
    })

    CREATE (i:Interpretation {
        value: $interpretation
    })

    MERGE (s)-[:HAS_READING]->(r)
    MERGE (r)-[:INTERPRETED_AS]->(i)
    `

/**
 * Cypher query to retrieve sensor data and their interpretations for a specific farm owned by a user.
 *
 * @remarks
 * - Matches a user by username and finds the farm they own by farm name.
 * - Retrieves all sensors associated with the farm and their readings.
 * - Optionally matches any interpretations for each reading.
 * - Returns the farm name, sensor ID, reading details, and interpretation value (if available).
 * - Results are ordered by the reading's creation date in descending order.
 *
 * @param {string} $username - The username of the user who owns the farm.
 * @param {string} $farmName - The name of the farm to retrieve sensor data for.
 *
 * @returns {Object[]} An array of objects containing:
 *   - farmName: The name of the farm.
 *   - sensorId: The unique identifier of the sensor.
 *   - reading: The reading node with all its properties.
 *   - interpretation: The interpreted value of the reading, if available.
 */
export const getSensorDataByFarmCypher = `
    MATCH (u:User {username: $username})-[:OWNS]->(f:Farm {name: $farmName})-[:HAS_SENSOR]->(s:Sensor)
    MATCH (s)-[:HAS_READING]->(r:Reading)
    OPTIONAL MATCH (r)-[:INTERPRETED_AS]->(i:Interpretation)
    RETURN f.name AS farmName, s.sensorId AS sensorId, r AS reading, i.value AS interpretation
    ORDER BY r.createdAt DESC
	`

/**
 * Cypher query to retrieve recent soil readings and plant scans for a specific farm owned by a user.
 *
 * @remarks
 * - Matches a user by `username` and their owned farm by `farmName`.
 * - Optionally matches soil readings (`Reading`) and plant scans (`PlantScan`) associated with the farm,
 *   filtering both by a cutoff datetime.
 * - Returns collections of soil readings and plant scans that are newer than the specified cutoff.
 *
 * @param {string} $username - The username of the user.
 * @param {string} $farmName - The name of the farm.
 * @param {string} $cutoff - The cutoff datetime (ISO 8601 string) to filter recent readings and scans.
 *
 * @returns {Object} An object containing:
 *   - `soilReadings`: Array of recent soil reading nodes.
 *   - `plantScans`: Array of recent plant scan nodes.
 */
export const getRecentFarmScansCypher = `
    MATCH (u:User {username: $username})-[:OWNS]->(f:Farm {name: $farmName})
    OPTIONAL MATCH (f)-[:HAS_SOIL_READING]->(soil:Reading)
        WHERE soil.createdAt >= datetime($cutoff)
    OPTIONAL MATCH (f)-[:HAS_PLANT_SCAN]->(PlantScan:PlantScan)
        WHERE PlantScan.date >= datetime($cutoff)
    RETURN collect(soil) AS soilReadings, collect(PlantScan) AS plantScans
	`

/**
 * Cypher query string to save a plant scan in the Neo4j database.
 *
 * This query performs the following operations:
 * - Merges (creates if not exists) a `User` node identified by the provided `username`.
 * - Merges a `Farm` node identified by the provided `farmName`.
 * - Creates an `OWNS` relationship from the user to the farm.
 * - Merges a `PlantScan` node with the specified properties: `cropType`, `date`, `note`, `lat`, `lng`, and `interpretation`.
 * - Creates a `HAS_PLANT_SCAN` relationship from the farm to the plant scan.
 *
 * @constant
 * @type {string}
 * @param {string} $username - The username of the user.
 * @param {string} $farmName - The name of the farm.
 * @param {string} $cropType - The type of crop scanned.
 * @param {string} $date - The date of the plant scan.
 * @param {string} $note - Additional notes about the scan.
 * @param {number} $lat - Latitude coordinate of the scan.
 * @param {number} $lng - Longitude coordinate of the scan.
 * @param {string} $interpretation - Interpretation or result of the scan.
 */
export const savePlantScanCypher = 					`
    MERGE (u:User {username: $username})
    MERGE (f:Farm {name: $farmName})
    MERGE (u)-[:OWNS]->(f)
    MERGE (p:PlantScan {
        cropType: $cropType,
        date: $date,
        note: $note,
        lat: $lat,
        lng: $lng,
        interpretation: $interpretation
    })
    MERGE (f)-[:HAS_PLANT_SCAN]->(p)
    `
