"use client";

import { useState, useEffect, useRef } from "react";

export default function HomePage() {
    const [url, setUrl] = useState("");
    const [qrData, setQrData] = useState<string | null>(null);
    const [title, setTitle] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current !== null) inputRef.current.focus();
    }, []);

    async function handleGenerate() {
        setQrData(null);
        setTitle("");
        if (!url) return alert("Enter a YouTube URL");

        const res = await fetch(`/api/generate-qr?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (data.error) return alert("Error: " + data.error);
        setTitle(data.title);
        setQrData(data.qrDataUrl);
    }

    function handleDownload() {
        if (!qrData) return;
        const a = document.createElement("a");
        a.href = qrData;
        a.download = `QR_CODE_${title}.png`;
        a.click();
    }

    return (
        <main className="flex flex-col items-center justify-center p-8 gap-4 min-h-screen bg-blue-50">
            <h1 className="text-2xl font-bold">🎬 YouTube QR Code Generator</h1>

            <input
                className="border p-2 rounded w-96"
                placeholder="Paste YouTube URL…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                ref={inputRef}
            />

            <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Generate QR Code
            </button>

            {qrData && (
                <div className="mt-6 text-center">
                    <p className="font-semibold mb-2">
                        Video title: <span className="text-blue-500">{title}</span>
                    </p>
                    <img src={qrData} alt={`QR code for ${title}`} className="border rounded shadow-lg mx-auto" />
                    <button
                        onClick={handleDownload}
                        className="mt-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                        Download PNG
                    </button>
                </div>
            )}
        </main>
    );
}
