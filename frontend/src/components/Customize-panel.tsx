"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CustomizationPanelProps {
    hairStyle: string
    setHairStyle: (style: string) => void
    hairColor: string
    setHairColor: (color: string) => void
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
    hairStyle,
    setHairStyle,
    hairColor,
    setHairColor,
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
    setFeetColor
}: CustomizationPanelProps) {
    const hairStyles = [
        { id: "short", name: "Short" },
        { id: "long", name: "Long" },
        { id: "curly", name: "Curly" },
        { id: "mohawk", name: "Mohawk" },
    ]

    const shirtStyles = [
        { id: "tshirt", name: "T-Shirt" },
        { id: "hoodie", name: "Hoodie" },
        { id: "tank", name: "Tank Top" },
        { id: "jacket", name: "Jacket" },
    ]

    const pantsStyles = [
        { id: "jeans", name: "Jeans" },
        { id: "shorts", name: "Shorts" },
        { id: "cargo", name: "Cargo" },
        { id: "skirt", name: "Skirt" },
    ]

    const capStyles = [
        { id: "none", name: "None" },
        { id: "baseball", name: "Baseball" },
        { id: "tophat", name: "Top Hat" },
        { id: "cowboy", name: "Cowboy" },
        { id: "crown", name: "Crown" },
        { id: "fedora", name: "Fedora" },
        { id: "chef", name: "Chef Hat" },
    ]

    const colors = [
        "#8B4513",
        "#000000",
        "#FFD700",
        "#FF6347",
        "#32CD32",
        "#1E90FF",
        "#FF69B4",
        "#9370DB",
        "#FFA500",
        "#DC143C",
    ]

    const skinTones = ["#FDBCB4", "#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#654321"]

    return (
        <div className="w-80 bg-white/90 backdrop-blur-sm p-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Character Customizer</h2>

            {/* Hair Section */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">Hair</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {hairStyles.map((style) => (
                                <Button
                                    key={style.id}
                                    variant={hairStyle === style.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setHairStyle(style.id)}
                                    className="text-xs"
                                >
                                    {style.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full border-2 ${hairColor === color ? "border-gray-800" : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setHairColor(color)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shirt Section */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">Shirt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {shirtStyles.map((style) => (
                                <Button
                                    key={style.id}
                                    variant={shirtStyle === style.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShirtStyle(style.id)}
                                    className="text-xs"
                                >
                                    {style.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full border-2 ${shirtColor === color ? "border-gray-800" : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setShirtColor(color)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pants Section */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">Pants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {pantsStyles.map((style) => (
                                <Button
                                    key={style.id}
                                    variant={pantsStyle === style.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPantsStyle(style.id)}
                                    className="text-xs"
                                >
                                    {style.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full border-2 ${pantsColor === color ? "border-gray-800" : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setPantsColor(color)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cap Section */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">Cap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {capStyles.map((style) => (
                                <Button
                                    key={style.id}
                                    variant={capStyle === style.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCapStyle(style.id)}
                                    className="text-xs"
                                >
                                    {style.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {capStyle !== "none" && capStyle !== "crown" && capStyle !== "chef" && (
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Color</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`w-8 h-8 rounded-full border-2 ${capColor === color ? "border-gray-800" : "border-gray-300"
                                            }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setCapColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Feet Section */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">Feet Color</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        {colors.map((c) => (
                            <button
                                key={c}
                                className={`w-10 h-10 rounded-full border-2 ${feetColor === c ? "border-gray-800" : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: c }}
                                onClick={() => setFeetColor(c)}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Skin Tone Section */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">Skin Tone</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        {skinTones.map((tone) => (
                            <button
                                key={tone}
                                className={`w-10 h-10 rounded-full border-2 ${skinColor === tone ? "border-gray-800" : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: tone }}
                                onClick={() => setSkinColor(tone)}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
