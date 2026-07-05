"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/store";
import { getSettings, updateSettings } from "@/app/actions/settings";
import toast from "react-hot-toast";

export default function DataSharingSettings() {
    const { isDarkMode } = useThemeStore();
    const [shareWithThirdParties, setShareWithThirdParties] = useState(false);
    const [useForResearch, setUseForResearch] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getSettings().then(settings => {
            setShareWithThirdParties(
                settings.data_sharing.shareWithThirdParties
            );
            setUseForResearch(settings.data_sharing.useForResearch);
            setLoaded(true);
        });
    }, []);

    const save = async (next: {
        shareWithThirdParties: boolean;
        useForResearch: boolean;
    }) => {
        const result = await updateSettings({ data_sharing: next });
        if (result.success) {
            toast.success("Preferences saved");
        } else {
            toast.error(result.error || "Failed to save preferences");
        }
    };

    const titleColor = isDarkMode ? "text-gray-100" : "text-gray-900";
    const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";

    const ToggleSwitch = ({
        checked,
        onChange,
        label,
    }: {
        checked: boolean;
        onChange: (checked: boolean) => void;
        label: string;
    }) => (
        <div className="flex items-center justify-between py-3">
            <span className={`text-sm ${textColor}`}>{label}</span>
            <button
                type="button"
                disabled={!loaded}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
                    checked ? "bg-primary" : "bg-gray-300"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className={`w-full`}>
            <h2 className={`text-lg font-semibold ${titleColor} mb-6`}>
                Data Sharing
            </h2>
            <ToggleSwitch
                checked={shareWithThirdParties}
                onChange={value => {
                    setShareWithThirdParties(value);
                    save({
                        shareWithThirdParties: value,
                        useForResearch,
                    });
                }}
                label="Share data with third parties"
            />
            <ToggleSwitch
                checked={useForResearch}
                onChange={value => {
                    setUseForResearch(value);
                    save({
                        shareWithThirdParties,
                        useForResearch: value,
                    });
                }}
                label="Use data for research"
            />
        </div>
    );
}
