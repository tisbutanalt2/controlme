declare global {
    namespace Auth {
        interface ShareLink {
            type: import('enum').ShareLinkType;
            id: string;
    
            /** Max amount of times the link can be used */
            maxUses?: number;
    
            /** Current amount of uses */
            uses?: number;
    
            /** Expiration timestamp (unix) */
            expiration?: number;
    
            /** Optional function overrides */
            functionOverrides?: ControlMe.FunctionOverrides;
        }

        type ReducedShareLink = Pick<
            ShareLink,
            'id'|'type'|'functionOverrides'
        >;
    }
}

export {};