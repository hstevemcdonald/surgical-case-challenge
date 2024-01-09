import { type Dispatch, type SetStateAction } from "react";

export interface Case {
    patientId: number;
    externalId: string;
    patientName?: string;
    surgeonId: number;
    surgeonName?: string;
    procedure: string;
    diagnosis: string;
    dateOfSurgery?: string;
    convertedDateOfSurgery?: string;
    icd10Code: string;
};

export interface AutoCompleteItem {
    id: number;
    name: string;
    externalId?: string;
}

export interface KeyLabel {
    key: string;
    label: string;
}

export interface AutoCompleteList {
    patients: AutoCompleteItem[];
    surgeons: AutoCompleteItem[];
}

export interface AddCaseModalProps {
    showAddCaseModal: boolean;
    setShowAddCaseModal: Dispatch<SetStateAction<boolean>>
    autoCompleteList: AutoCompleteList;
    setCookie: Dispatch<SetStateAction<string>>;
}
