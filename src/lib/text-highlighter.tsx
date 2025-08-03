import React from "react";
import Tooltip from "@/components/small/Tooltip/Tooltip";

interface TechnicalTerm {
    term: string;
    definition: string;
}

export function highlightTechnicalTerms(
    text: string,
    technicalTerms: TechnicalTerm[]
): React.ReactNode[] {
    if (!technicalTerms || technicalTerms.length === 0) {
        return [text];
    }

    let result: React.ReactNode[] = [text];

    technicalTerms.forEach((techTerm, index) => {
        const newResult: React.ReactNode[] = [];
        let found = false;

        result.forEach(item => {
            if (typeof item === "string" && !found) {
                const parts = item.split(
                    new RegExp(`(${techTerm.term})`, "gi")
                );
                parts.forEach((part, partIndex) => {
                    if (
                        part.toLowerCase() === techTerm.term.toLowerCase() &&
                        !found
                    ) {
                        found = true;
                        newResult.push(
                            <Tooltip
                                key={`${index}-${partIndex}`}
                                term={techTerm.term}
                                definition={techTerm.definition}
                            >
                                {part}
                            </Tooltip>
                        );
                    } else if (part) {
                        newResult.push(part);
                    }
                });
            } else {
                newResult.push(item);
            }
        });

        result = newResult;
    });

    return result;
}
