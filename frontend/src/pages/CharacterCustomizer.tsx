"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useState } from "react"
import Character from "../components/Character"
import CustomizationPanel from "../components/Customize-panel"

export default function CharacterCustomizer() {
    const [hairStyle, setHairStyle] = useState("short")
    const [hairColor, setHairColor] = useState("#8B4513")
    const [shirtStyle, setShirtStyle] = useState("tshirt")
    const [shirtColor, setShirtColor] = useState("#3498db")
    const [pantsStyle, setPantsStyle] = useState("jeans")
    const [pantsColor, setPantsColor] = useState("#2c3e50")
    const [skinColor, setSkinColor] = useState("#FDBCB4")
    const [capStyle, setCapStyle] = useState("none")
    const [capColor, setCapColor] = useState("#8B0000")
    const [feetColor, setFeetColor] = useState("#8B4513")

    const characterProps = {
        hairStyle,
        hairColor,
        shirtStyle,
        shirtColor,
        pantsStyle,
        pantsColor,
        skinColor,
        capStyle,
        capColor,
        feetColor,
    }

    return (
        <div className="w-full h-screen flex">
            <div className="flex-1">
                <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
                    <Environment preset="studio" />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                    <Character {...characterProps} />
                    <OrbitControls
                        enablePan={false}
                        minDistance={2}
                        maxDistance={8}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2}
                    />
                </Canvas>
            </div>
            <CustomizationPanel
                hairStyle={hairStyle}
                setHairStyle={setHairStyle}
                hairColor={hairColor}
                setHairColor={setHairColor}
                shirtStyle={shirtStyle}
                setShirtStyle={setShirtStyle}
                shirtColor={shirtColor}
                setShirtColor={setShirtColor}
                pantsStyle={pantsStyle}
                setPantsStyle={setPantsStyle}
                pantsColor={pantsColor}
                setPantsColor={setPantsColor}
                skinColor={skinColor}
                setSkinColor={setSkinColor}
                capStyle={capStyle}
                setCapStyle={setCapStyle}
                capColor={capColor}
                setCapColor={setCapColor}
                feetColor={feetColor}
                setFeetColor={setFeetColor}
            />
        </div>
    )
}
