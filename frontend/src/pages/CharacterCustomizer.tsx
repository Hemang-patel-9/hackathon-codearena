"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, SpotLight } from "@react-three/drei"
import { useState } from "react"
import Character from "../components/Character"
import CustomizationPanel from "../components/Customize-panel"

export default function CharacterCustomizer() {
    const [shirtStyle, setShirtStyle] = useState("tshirt")
    const [shirtColor, setShirtColor] = useState("#3498db")
    const [pantsStyle, setPantsStyle] = useState("jeans")
    const [pantsColor, setPantsColor] = useState("#2c3e50")
    const [skinColor, setSkinColor] = useState("#FDBCB4")
    const [capStyle, setCapStyle] = useState("baseball")
    const [capColor, setCapColor] = useState("#8B0000")
    const [feetColor, setFeetColor] = useState("#8B4513")

    const characterProps = {
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
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden">
            {/* Left Panel - Customization */}
            <div className="w-[40%] h-full">
                <CustomizationPanel
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

            {/* Right Panel - Character Display */}
            <div className="flex-1 w-[60%] relative">
                {/* Spotlight Background Effect */}
                <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-30"></div>

                {/* Character Canvas */}
                <Canvas camera={{ position: [0, 1, 4], fov: 50 }} className="w-full h-full">
                    {/* Lighting Setup */}
                    <Environment preset="studio" />
                    <ambientLight intensity={0.3} />

                    {/* Main Spotlight */}
                    <SpotLight
                        position={[0, 8, 6]}
                        angle={0.6}
                        penumbra={0.5}
                        intensity={2}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        color="#ffffff"
                        target-position={[0, 0, 0]}
                    />

                    {/* Rim Light */}
                    <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8b5cf6" />

                    {/* Fill Light */}
                    <directionalLight position={[5, 2, 5]} intensity={0.3} color="#06b6d4" />

                    {/* Ground Plane for Shadows */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
                        <circleGeometry args={[1.5, 64]} /> {/* Changed to circleGeometry with radius 5 and 64 segments */}
                        <meshStandardMaterial color="#a020f0" transparent opacity={0.8} />
                    </mesh>

                    <Character {...characterProps} />

                    <OrbitControls
                        enablePan={false}
                        minDistance={2}
                        maxDistance={8}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2}
                        enableDamping
                        dampingFactor={0.05}
                    />
                </Canvas>

                {/* Character Info Overlay */}
                <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <h3 className="text-white font-semibold text-lg mb-2">Character Preview</h3>
                    <div className="text-white/70 text-sm space-y-1">
                        <p>
                            Style: {capStyle} + {shirtStyle}
                        </p>
                        <p>Drag to rotate • Scroll to zoom</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
