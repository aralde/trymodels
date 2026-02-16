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
    id: string;
    name: string;
    url: string;
    type: "Free" | "Trial";
    limits: string;
    tpm?: number;
    rpm?: number;
    rpd?: number;
    tpd?: number;
    models: (string | ModelLimit)[];
}

