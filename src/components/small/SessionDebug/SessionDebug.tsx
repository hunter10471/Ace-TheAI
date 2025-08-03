"use client";
import React from "react";
import { useSession } from "next-auth/react";

const SessionDebug: React.FC = () => {
    const { data: session, status } = useSession();

    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h3 className="font-bold mb-2">Session Debug</h3>
            <div className="space-y-1">
                <div>
                    <strong>Status:</strong> {status}
                </div>
                <div>
                    <strong>Authenticated:</strong>{" "}
                    {status === "authenticated" ? "Yes" : "No"}
                </div>
                {session?.user && (
                    <>
                        <div>
                            <strong>User ID:</strong> {session.user.id}
                        </div>
                        <div>
                            <strong>Email:</strong> {session.user.email}
                        </div>
                        <div>
                            <strong>Name:</strong> {session.user.name}
                        </div>
                        <div>
                            <strong>Provider:</strong> {session.user.provider}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SessionDebug;
