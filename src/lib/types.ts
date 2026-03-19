export interface ModelLimit {
    name: string;
    rpm?: number;
    rpd?: number;
    tpm?: number;
    tpd?: number;
    ash?: number;
    asd?: number;
}

export interface Provider {
    id?: string; // Optional, can be derived from name
    name: string;
    url?: string; // Made optional as some entries might not have it populated top-level
    type?: string; // e.g. "Free"

    // V2 Schema Fields
    models: {
        model_id: string;
        limits: {
            RPM?: number | string;
            RPD?: number | string;
            TPM?: number | string;
            TPD?: number | string;
            [key: string]: string | number | boolean | undefined;
        };
        api_model_name?: string;
        tool_call?: boolean;
        reasoning?: boolean;
        input?: string[];
        output?: string[];
        context_limit?: number;
        output_limit?: number;
    }[];
    notes?: string; // "notes" top level instead of "limits.notes"
    privacy_notes?: string; // specific privacy notes
    context_window?: string;
    link_url?: string;
}
