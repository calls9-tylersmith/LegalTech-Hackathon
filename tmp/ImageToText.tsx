import { useEffect, useState } from "react";

export const ImageToText = ({ question, setOutput }: {
    question: string;
    setOutput: (data: string) => void;
}) => {
    const [data, setData] = useState<File>();
    useEffect(() => {
        const main = async () => {
            if (!data) return;
            const r = await fetch("/answers/answer_question", {
                method: "POST",
                body: JSON.stringify({
                    question,
                    image: await toBase64(data),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setOutput(JSON.parse(await r.text()).data.data[0]);
        }
        main();
    }, [data]);

    return (
        <div className="flex flex-col">
            <input
                onChange={(e) => {
                    if (!e.target.files) return;
                    // set the data to the base64 string of the image
                    setData(e.target.files[0]);
                }}
                type="file"
            />
        </div>
    )
}

const toBase64 = (file:any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});