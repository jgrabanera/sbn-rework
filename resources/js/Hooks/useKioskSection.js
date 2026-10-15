import axios from "axios";
import { useCallback, useEffect, useState } from "react";

/**
 * Fetches a public kiosk section endpoint, exposing consistent
 * loading / error / retry state so the tab components stay declarative.
 *
 * An `error` here means the request failed (network/server). An empty
 * result set is *not* an error and is handled by the caller.
 */
const useKioskSection = (url, { enabled = true } = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(enabled));
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(url);
            setData(response.data);
        } catch (requestError) {
            const errors = requestError?.response?.data?.errors;
            setError(
                Array.isArray(errors)
                    ? errors[0]
                    : errors || requestError?.message || null,
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [url, enabled]);

    useEffect(() => {
        load();
    }, [load]);

    return { data, loading, error, retry: load };
};

export default useKioskSection;