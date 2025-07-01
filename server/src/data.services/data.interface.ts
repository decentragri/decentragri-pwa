import type { SensorReadingsWithInterpretation } from "../ai.services/soil.ai.team.service/soil.types";



// This file defines the interfaces for the data services used in the application.
export interface PlantScanResult {
	cropType: string;
	note: string | null;
	lat: number | null;
	lng: number | null;
	createdAt: string; // ISO 8601 format
	interpretation: string | ParsedInterpretation
}

// This interface represents the parsed interpretation of a plant scan result.
export interface ParsedInterpretation {
	Diagnosis: string;
	Reason: string;
	Recommendations: string[];
}

export interface FarmScanResult {
    plantScans: PlantScanResult[];
    soilReadings: SensorReadingsWithInterpretation[];
}