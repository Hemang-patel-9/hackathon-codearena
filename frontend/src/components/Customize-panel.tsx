"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface CustomizationPanelProps {
    shirtStyle: string
    setShirtStyle: (style: string) => void
    shirtColor: string
    setShirtColor: (color: string) => void
    pantsStyle: string
    setPantsStyle: (style: string) => void
    pantsColor: string
    setPantsColor: (color: string) => void
    skinColor: string
    setSkinColor: (color: string) => void
    capStyle: string
    setCapStyle: (style: string) => void
    capColor: string
    setCapColor: (color: string) => void
    feetColor: string
    setFeetColor: (color: string) => void
}

export default function CustomizationPanel({
    shirtStyle,
    setShirtStyle,
    shirtColor,
    setShirtColor,
    pantsStyle,
    setPantsStyle,
    pantsColor,
    setPantsColor,
    skinColor,
    setSkinColor,
    capStyle,
    setCapStyle,
    capColor,
    setCapColor,
    feetColor,
    setFeetColor,
}: CustomizationPanelProps) {
    const [activeSection, setActiveSection] = useState("shirt")
    const [shirtTab, setShirtTab] = useState("style")
    const [pantsTab, setPantsTab] = useState("style")
    const [capTab, setCapTab] = useState("style")

    const shirtStyles = [
        {
            id: "tshirt",
            name: "T-Shirt",
            icon: "👕",
            description: "Casual cotton tee",
        },
        {
            id: "shirt",
            name: "Shirt",
            icon: "👔",
            description: "Classic button-up",
        },
        {
            id: "hoodie",
            name: "Hoodie",
            icon: "🧥",
            description: "Cozy pullover",
        },
        {
            id: "tank",
            name: "Tank Top",
            icon: "🎽",
            description: "Sleeveless athletic",
        },
    ]

    const pantsStyles = [
        {
            id: "jeans",
            name: "Jeans",
            icon: "👖",
            description: "Classic denim",
        },
        {
            id: "shorts",
            name: "Shorts",
            icon: "🩳",
            description: "Summer casual",
        },
        {
            id: "cargo",
            name: "Cargo",
            icon: "👖",
            description: "Multi-pocket utility",
        },
        {
            id: "skirt",
            name: "Skirt",
            icon: "👗",
            description: "Flowing feminine",
        },
    ]

    const capStyles = [
        {
            id: "baseball",
            name: "Baseball",
            icon: "🧢",
            description: "Sports visor cap",
        },
        {
            id: "tophat",
            name: "Top Hat",
            icon: "🎩",
            description: "Elegant formal",
        },
        {
            id: "cowboy",
            name: "Cowboy",
            icon: "🤠",
            description: "Western wide-brim",
        },
        {
            id: "crown",
            name: "Crown",
            icon: "👑",
            description: "Royal golden",
        },
        {
            id: "fedora",
            name: "Fedora",
            icon: "🎩",
            description: "Classic detective",
        },
        {
            id: "chef",
            name: "Chef Hat",
            icon: "👨‍🍳",
            description: "Professional kitchen",
        },
    ]

    const colors = [
        { hex: "#8B4513", name: "Brown" },
        { hex: "#000000", name: "Black" },
        { hex: "#FFD700", name: "Gold" },
        { hex: "#FF6347", name: "Tomato" },
        { hex: "#32CD32", name: "Lime" },
        { hex: "#1E90FF", name: "Blue" },
        { hex: "#FF69B4", name: "Pink" },
        { hex: "#9370DB", name: "Purple" },
        { hex: "#FFA500", name: "Orange" },
        { hex: "#DC143C", name: "Crimson" },
    ]

    const skinTones = [
        { hex: "#FDBCB4", name: "Light" },
        { hex: "#F1C27D", name: "Fair" },
        { hex: "#E0AC69", name: "Medium" },
        { hex: "#C68642", name: "Olive" },
        { hex: "#8D5524", name: "Brown" },
        { hex: "#654321", name: "Dark" },
    ]

    const sections = [
        { id: "shirt", name: "Tops", icon: "👕" },
        { id: "pants", name: "Bottoms", icon: "👖" },
        { id: "cap", name: "Headwear", icon: "🧢" },
        { id: "accessories", name: "Extras", icon: "✨" },
    ]

    return (
        <div className="bg-transparent h-[99%] scrollbar-hide overflow-y-auto backdrop-blur-xl border-r border-white/10">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Style Studio</h2>
                <p className="text-slate-300 text-sm">Customize your character</p>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex border-b border-white/10">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-1 p-4 text-sm font-medium transition-all duration-200 ${activeSection === section.id
                            ? "bg-purple-600/20 text-purple-300 border-b-2 border-purple-400"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-lg">{section.icon}</span>
                            <span className="text-xs">{section.name}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 space-y-4">


                {/* Pants Section */}
                {activeSection === "pants" && (
                    <div className="space-y-4 animate-in slide-in-from-right duration-300">
                        {/* Pants Sub-tabs */}
                        <div className="flex bg-white/5 rounded-lg p-1">
                            <button
                                onClick={() => setPantsTab("style")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${pantsTab === "style"
                                    ? "bg-purple-500/30 text-white shadow-sm"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                ✨ Style
                            </button>
                            <button
                                onClick={() => setPantsTab("color")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${pantsTab === "color"
                                    ? "bg-purple-500/30 text-white shadow-sm"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                🎨 Color
                            </button>
                        </div>

                        {/* Pants Content */}
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    👖 Pants {pantsTab === "style" ? "Styles" : "Colors"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pantsTab === "style" ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {pantsStyles.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => setPantsStyle(style.id)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${pantsStyle === style.id
                                                    ? "border-purple-400 bg-purple-500/20 text-white"
                                                    : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{style.icon}</div>
                                                <div className="text-sm font-medium">{style.name}</div>
                                                <div className="text-xs opacity-70">{style.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-5 gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.hex}
                                                onClick={() => setPantsColor(color.hex)}
                                                className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${pantsColor === color.hex
                                                    ? "border-white shadow-lg shadow-white/25"
                                                    : "border-white/30 hover:border-white/60"
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Shirt Section */}
                {activeSection === "shirt" &&
                    (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            {/* Shirt Sub-tabs */}
                            {/* <div className="flex bg-white/5 rounded-lg p-1">
                                <button
                                onClick={() => setShirtTab("style")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${shirtTab === "style"
                                        ? "bg-purple-500/30 text-white shadow-sm"
                                        : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                ✨ Style
                            </button>
                                <button
                                    onClick={() => setShirtTab("color")}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${shirtTab === "color"
                                        ? "bg-purple-500/30 text-white shadow-sm"
                                        : "text-slate-300 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    🎨 Color
                                </button>
                            </div> */}

                            {/* Shirt Content */}
                            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        👕 Shirt {shirtTab === "style" ? "Styles" : "Colors"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-5 gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.hex}
                                                onClick={() => setShirtColor(color.hex)}
                                                className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${shirtColor === color.hex
                                                    ? "border-white shadow-lg shadow-white/25"
                                                    : "border-white/30 hover:border-white/60"
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    {/* {shirtTab === "style" ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {shirtStyles.map((style) => (
                                                <button
                                                    key={style.id}
                                                    onClick={() => setShirtStyle(style.id)}
                                                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${shirtStyle === style.id
                                                        ? "border-purple-400 bg-purple-500/20 text-white"
                                                        : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10"
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{style.icon}</div>
                                                    <div className="text-sm font-medium">{style.name}</div>
                                                    <div className="text-xs opacity-70">{style.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-5 gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.hex}
                                                    onClick={() => setShirtColor(color.hex)}
                                                    className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${shirtColor === color.hex
                                                        ? "border-white shadow-lg shadow-white/25"
                                                        : "border-white/30 hover:border-white/60"
                                                        }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    )} */}
                                </CardContent>
                            </Card>
                        </div>
                    )
                }

                {/* Cap Section */}
                {activeSection === "cap" && (
                    <div className="space-y-4 animate-in slide-in-from-right duration-300">
                        {/* Cap Sub-tabs */}
                        <div className="flex bg-white/5 rounded-lg p-1">
                            <button
                                onClick={() => setCapTab("style")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${capTab === "style"
                                    ? "bg-purple-500/30 text-white shadow-sm"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                ✨ Style
                            </button>
                            <button
                                onClick={() => setCapTab("color")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${capTab === "color"
                                    ? "bg-purple-500/30 text-white shadow-sm"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                🎨 Color
                            </button>
                        </div>

                        {/* Cap Content */}
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    🧢 Headwear {capTab === "style" ? "Styles" : "Colors"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {capTab === "style" ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {capStyles.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => setCapStyle(style.id)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${capStyle === style.id
                                                    ? "border-purple-400 bg-purple-500/20 text-white"
                                                    : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{style.icon}</div>
                                                <div className="text-sm font-medium">{style.name}</div>
                                                <div className="text-xs opacity-70">{style.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    capStyle !== "crown" &&
                                    capStyle !== "chef" && (
                                        <div className="grid grid-cols-5 gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.hex}
                                                    onClick={() => setCapColor(color.hex)}
                                                    className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${capColor === color.hex
                                                        ? "border-white shadow-lg shadow-white/25"
                                                        : "border-white/30 hover:border-white/60"
                                                        }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    )
                                )}
                                {capTab === "color" && (capStyle === "crown" || capStyle === "chef") && (
                                    <div className="text-center text-slate-400 py-8">
                                        <p className="text-sm">This item has a fixed color</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Accessories Section */}
                {activeSection === "accessories" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        {/* Footwear Colors */}
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">👟 Footwear Colors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.hex}
                                            onClick={() => setFeetColor(color.hex)}
                                            className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${feetColor === color.hex
                                                ? "border-white shadow-lg shadow-white/25"
                                                : "border-white/30 hover:border-white/60"
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skin Tones */}
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">🎨 Skin Tones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-3">
                                    {skinTones.map((tone) => (
                                        <button
                                            key={tone.hex}
                                            onClick={() => setSkinColor(tone.hex)}
                                            className={`w-16 h-16 rounded-full border-4 transition-all duration-200 hover:scale-110 ${skinColor === tone.hex
                                                ? "border-white shadow-lg shadow-white/25"
                                                : "border-white/30 hover:border-white/60"
                                                }`}
                                            style={{ backgroundColor: tone.hex }}
                                            title={tone.name}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    )
}
