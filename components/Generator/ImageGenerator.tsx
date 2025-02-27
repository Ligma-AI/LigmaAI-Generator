/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
"use client";

import {
    FC,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Icons } from "@/components/Icons";
import { usePrediction } from "@/hooks/usePrediction";
import { Spinner } from "@/components/Spinner";
import { cn, onDownload } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Zoom, { Controlled as ControlledZoom } from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css'
import GeneratedList from "@/components/Generated/GeneratedList";
import {
    CircleHelp,
    CircleX,
    FileVideo,
    Image,
    ImageIcon,
    List,
    Upload,
    Video,
    VideoIcon,
    X,
} from "lucide-react";
import ApplicationsOf from "@/components/Applications/ApplicationsOf";
import ImageToolbar from "@/components/Toolbars/ImageToolbar";

// Add API configuration at the top of the component
const API_CONFIG = {
    url: 'https://api.getimg.ai/v1/flux-schnell/text-to-image',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer key-3gwhz4Ztn5SVR6eJAA0a1WjNmWIuy4CduEfbseBqlR5EEomSQtoPCXXmGCCBFNJPUuyULMIZJ0V00fca68e424UqK2NdBSZB'
    }
};

const ImageGenerator = ({ user, generated }: any) => {
    const leftElementRef = useRef<any>(null);
    const [elementHeight, setElementHeight] = useState(0);
    const [generating, setGenerating] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [textPrompts, setTextPrompts] = useState("");
    const [aspectRatio, setAspectRatio] = useState([
        { label: "1:1", ratio: "1:1", id: "ratio-1-1", width: 1024, height: 1024, checked: true },
        { label: "16:9", ratio: "16:9", id: "ratio-16-9", width: 1024, height: 576 },
        { label: "9:16", ratio: "9:16", id: "ratio-9-16", width: 576, height: 1024 },
        { label: "3:2", ratio: "3:2", id: "ratio-3-2", width: 1024, height: 683 },
        { label: "2:3", ratio: "2:3", id: "ratio-2-3", width: 683, height: 1024 },
    ]);
    const [model, setModel] = useState([
        { 
            label: "Sticker", 
            value: "sticker", 
            selected: true,
            promptPrefix: "Create a cute sticker design of",
            promptSuffix: ", with clean outlines, kawaii style, white background"
        },
        { 
            label: "Pixel Art", 
            value: "pixel", 
            promptPrefix: "pixel art style, 16-bit graphics of",
            promptSuffix: ", pixelated, retro game style"
        },
        { 
            label: "Ghibli Style", 
            value: "ghibli",
            promptPrefix: "Studio Ghibli anime style, Miyazaki inspired art of",
            promptSuffix: ", hand-drawn animation, soft colors, detailed backgrounds"
        },
        { 
            label: "Realistic", 
            value: "realistic",
            promptPrefix: "hyperrealistic photograph of",
            promptSuffix: ", 8k, detailed, professional photography"
        }
    ]);
    
    // Add this after the model state declaration
    const modelPreviews = {
        sticker: "/previews/sticker.png",
        pixel: "/previews/pixel.png",
        ghibli: "/previews/ghibli.png",
        realistic: "/previews/real.png"
    };

    const {
        error,
        prediction,
        handleSubmit,
    }: any = usePrediction();
    const t = useTranslations("Generation");

    useLayoutEffect(() => {
        if (leftElementRef.current) {
            setElementHeight(leftElementRef.current.clientHeight);
        }
    }, []);

    // handle Generative
    const handleGenerative = async () => {
        if (!textPrompts) {
            toast.error("Please enter the prompt word!");
            return;
        }

        setGenerating(true);
        try {
            const selectedRatio = aspectRatio.find((item) => item.checked);
            const selectedModel = model.find((m) => m.selected);
            
            // Construct the customized prompt
            const customizedPrompt = `${selectedModel?.promptPrefix} ${textPrompts} ${selectedModel?.promptSuffix}`;
            
            const options = {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({
                    prompt: customizedPrompt,
                    response_format: 'url',
                    width: selectedRatio?.width || 1024,
                    height: selectedRatio?.height || 1024
                })
            };

            const response = await fetch(API_CONFIG.url, options);
            const json = await response.json();

            // Update the generation state with the response
            if (json.url) {
                setGeneration({
                    url: json.url,
                    cost: json.cost,
                    seed: json.seed
                });
                setGenerating(false);
            } else {
                throw new Error('Failed to generate image');
            }
        } catch (error: any) {
            console.error('Generation error:', error);
            toast.error("Failed to generate image. Please try again.");
            setGenerating(false);
        }
    };

    // Add state for generation results
    const [generation, setGeneration] = useState<{
        url: string;
        cost?: number;
        seed?: number;
    } | null>(null);

    // Comment out or remove the handleShare function
    /*
    const handleShare = async (
        social: string,
        href: string,
        imageUrl?: string
    ) => {
        if (!generation?.url) {
            toast.error("No image to share");
            return;
        }

        const shareText = encodeURIComponent("Check this image generated with AI");
        const shareUrl = encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || window.location.origin);
        const shareImage = encodeURIComponent(generation.url);

        let url = "";
        switch (social) {
            // ... switch cases
        }

        try {
            window.open(url, "_blank");
        } catch (error) {
            console.error('Share error:', error);
            toast.error("Failed to open share dialog");
        }
    };
    */

    const handleDownload = async (onDownloaded: any) => {
        if (!generation?.url) {
            toast.error("No image to download");
            return;
        }

        try {
            // Create a link element
            const link = document.createElement('a');
            link.href = generation.url;
            link.download = `generated-image-${Date.now()}.jpg`;
            
            // Append to document, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Call callback if provided
            if (onDownloaded) {
                onDownloaded();
            }
            
            toast.success("Image download started");
        } catch (error) {
            console.error('Download error:', error);
            toast.error("Failed to download image");
        }
    };

    // Replace the existing handleMaximize function
    const handleMaximize = (shouldZoom: boolean) => {
        setIsZoomed(shouldZoom); // Now it properly toggles based on the parameter
    };

    const [isZoomed, setIsZoomed] = useState(false);

    const handleZoomChange = useCallback((shouldZoom: any) => {
        setIsZoomed(shouldZoom);
    }, []);

    // Example of how ImageToolbar should handle maximize click
    const onMaximizeClick = () => {
        handleMaximize(!isZoomed); // Toggle the zoom state
    };

    return (
        <>
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    <div
                        className="lg:col-span-7 space-y-4"
                        ref={leftElementRef}
                    >
                        {/* form section */}
                        <div className="space-y-2">
                            <label
                                htmlFor="prompts"
                                className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200"
                            >
                                {t("formPromptsLabel")}
                            </label>

                            <textarea
                                id="prompts"
                                className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                rows={6}
                                placeholder={t("formPromptsPlaceholer")}
                                value={textPrompts}
                                onInput={(e: any) =>
                                    setTextPrompts(e.target.value)
                                }
                            ></textarea>
                        </div>

                        {/* form section */}
                        <div className="space-y-2">
                            <label
                                htmlFor="prompts"
                                className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200"
                            >
                                {t("formRatioLabel")}
                            </label>

                            <div className="grid sm:grid-cols-5 gap-2">
                                {aspectRatio.map((item: any, idx: number) => (
                                    <div key={idx}>
                                        <label
                                            htmlFor={`hs-radio-in-form-${idx}`}
                                            className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                        >
                                            <input
                                                type="radio"
                                                name={`hs-radio-in-form`}
                                                className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                id={`hs-radio-in-form-${idx}`}
                                                checked={item.checked}
                                                disabled={item.disable}
                                                onChange={(e: any) => {
                                                    aspectRatio.map(
                                                        (r) =>
                                                            (r.checked = false)
                                                    );
                                                    item.checked =
                                                        e.target.checked;
                                                    setAspectRatio([
                                                        ...aspectRatio,
                                                    ]);
                                                }}
                                            />
                                            <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">
                                                {item.label}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* form section */}
                        <div className="space-y-2">
                            <label
                                htmlFor="prompts"
                                className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200"
                            >
                                {t("formModelsLabel")}
                            </label>

                            <div className="grid sm:grid-cols-5 gap-2">
                                <select
                                    className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    value={model.find((m) => m.selected)?.value}
                                    onChange={(e: any) => {
                                        const currentModel: any = model.find(
                                            (m) => m.value === e.target.value
                                        );
                                        model.map((r) => (r.selected = false));
                                        currentModel.selected = true;
                                        setModel([...model]);
                                    }}
                                >
                                    {model.map((item: any) => (
                                        <option
                                            key={item.value}
                                            value={item.value}
                                            disabled={item.disable}
                                            // selected={item.selected}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Model Preview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
                            {model.map((style) => (
                                <div 
                                    key={style.value}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                        style.selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-neutral-700'
                                    }`}
                                    onClick={() => {
                                        const updatedModel = model.map(m => ({
                                            ...m,
                                            selected: m.value === style.value
                                        }));
                                        setModel(updatedModel);
                                    }}
                                >
                                    <div className="aspect-square relative">
                                        <img
                                            src={modelPreviews[style.value as keyof typeof modelPreviews]}
                                            alt={`${style.label} preview`}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                            <p className="text-white text-sm font-medium">
                                                {style.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Generate Button Start */}
                        <div className="grid mt-20">
                            <button
                                type="submit"
                                className="py-2.5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={generating}
                                onClick={handleGenerative}
                            >
                                {generating ? (
                                    <span
                                        className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                                        role="status"
                                        aria-label="loading"
                                    ></span>
                                ) : null}
                                Generate
                                <span className="py-1 px-4 flex items-center gap-x-1 text-xs font-medium text-gray-100 rounded-full">
                                    {/* <Icons.CreditsIcon />1 */}
                                </span>
                            </button>
                            {/* <p className="my-2 text-xs text-center leading-6 text-gray-600 dark:text-neutral-400">
                                Each liveportrait animation video takes about 1
                                minute to generate
                            </p> */}
                        </div>
                        {/* Generate Button End */}
                    </div>
                    <div
                        className="mt-5 sm:mt-10 lg:mt-0 lg:col-span-5"
                        style={{ maxHeight: elementHeight + "px" }}
                    >
                        <div className="space-y-2 flex flex-col h-full overflow-hidden">
                            <label
                                htmlFor="prompts"
                                className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200"
                            >
                                {t("formResultLabel")}
                            </label>

                            <div className="group relative flex flex-col w-full min-h-60 flex-1 border border-dashed border-gray-300 bg-gray-100 dark:bg-neutral-900 dark:border-neutral-700 bg-center rounded-xl items-center justify-center focus:outline-none transition overflow-hidden">
                                {!generation ? (
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                ) : (
                                    <>
                                        <ControlledZoom
                                            isZoomed={isZoomed}
                                            onZoomChange={handleZoomChange}
                                        >
                                            <img
                                                src={generation.url}
                                                // className="object-contain h-48 w-96"
                                                className="object-contain"
                                                // width="1024"
                                                // height="1024"
                                                // width={elementHeight + "px"}
                                                height={elementHeight + "px"}
                                                onLoad={() =>
                                                    setImageLoading(false)
                                                }
                                            />
                                        </ControlledZoom>
                                        {/* Button Grouop */}
                                        <div className="absolute bottom-4 end-4">
                                            <div className="gen-image-toolbars flex">
                                                <ImageToolbar
                                                    imgUrl={generation.url}
                                                    handleDownload={
                                                        handleDownload
                                                    }
                                                    handleMaximize={
                                                        onMaximizeClick
                                                    }
                                                />
                                            </div>
                                            {/* or share by link */}
                                            {/* <div className="flex items-center gap-3">
                                                <div className="shrink-0 h-[1px] w-10 bg-gray-200 dark:bg-neutral-600"></div>
                                                <div className="py-3 flex items-center text-xs text-gray-400 uppercase dark:text-neutral-500">
                                                    Or share by link
                                                </div>
                                                <div className="shrink-0 h-[1px] w-10 bg-gray-200 dark:bg-neutral-600"></div>
                                            </div> */}
                                        </div>
                                    </>
                                )}
                                {/* <img src="https://images.unsplash.com/photo-1680193895115-b51b4ed5392f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80" className="object-contain h-48 w-96" alt="" /> */}
                                {/* <img
                                    src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
                                    className="object-contain h-48 w-96"
                                    alt=""
                                    onLoad={() => setImageLoading(false)}
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications of */}
                <ApplicationsOf />
            </div>
        </>
    );
};

export default ImageGenerator;
