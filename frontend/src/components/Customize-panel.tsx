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
        <div className="bg-gradient-to-b overflow-auto from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 ">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Style Studio</h2>
                <p className="text-slate-300 text-sm">Customize your character</p>
            </div>

            {/* Navigation Tabs */}
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
                {/* Shirt Section */}
                {activeSection === "shirt" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">


                        {/* Color Selection */}
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">🎨 Color Palette</CardTitle>
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
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Pants Section */}
                {activeSection === "pants" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">👖 Pants Style</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">🎨 Color Palette</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Cap Section */}
                {activeSection === "cap" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">🧢 Headwear Style</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>

                        {capStyle !== "crown" && capStyle !== "chef" && (
                            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">🎨 Color Palette</CardTitle>
                                </CardHeader>
                                <CardContent>
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
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Accessories Section */}
                {activeSection === "accessories" && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">👟 Footwear Color</CardTitle>
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

                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">🎨 Skin Tone</CardTitle>
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

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="text-center text-slate-400 text-xs">✨ Character Studio v2.0</div>
            </div>
        </div>
    )
}
