"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { type Group } from "three"
import { Capsule } from "@react-three/drei"

interface CharacterProps {
    shirtStyle: string
    shirtColor: string
    pantsStyle: string
    pantsColor: string
    skinColor: string
    capStyle: string
    capColor: string
    feetColor: string
}

export default function Character({
    shirtStyle,
    shirtColor,
    pantsStyle,
    pantsColor,
    skinColor,
    capStyle,
    capColor,
    feetColor
}: CharacterProps) {
    const groupRef = useRef<Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1
            groupRef.current.position.y = Math.sin(t * 0.8) * 0.02 - 1 // Gentle breathing animation
        }
    })

    return (
        <group ref={groupRef} position={[0, -1, 0]}>

            {/* Head - Oval shaped */}
            <mesh position={[0, 1.55, 0]} scale={[1, 1.2, 0.9]} castShadow>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Eyes */}
            <mesh position={[-0.08, 1.55, 0.18]} castShadow>
                <sphereGeometry args={[0.05, 32, 32]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[0.08, 1.55, 0.18]} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#000" />
            </mesh>

            {/* Nose */}
            <mesh position={[0, 1.45, 0.2]} castShadow>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Smile */}
            <mesh position={[0, 1.52, 0.18]} rotation={[0, 0, 0]} castShadow>
                <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#8B0000" />
            </mesh>

            {/* Cap - rendered over hair */}
            <Cap style={capStyle} color={capColor} />

            {/* Neck */}
            <mesh position={[0, 1.23, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.08]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Torso/Shirt */}
            <Shirt style={shirtStyle} color={shirtColor} />

            {/* Arms */}
            <group position={[-0.25, 0.92, 0]}>
                <mesh rotation={[0, 0, -0.5]} castShadow>
                    <cylinderGeometry args={[0.06, 0.04, 0.5]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
                <mesh position={[0.105, 0.21, 0]} rotation={[0, 0, -0.5]}>
                    <Capsule
                        args={[0.05, 0.05, 15, 32]} // [radius, length, capSegments, radialSegments]
                        castShadow
                    >
                        <meshStandardMaterial color={skinColor} />
                    </Capsule>
                </mesh>
            </group>
            <group position={[0.25, 0.92, 0]}>
                <mesh rotation={[0, 0, 0.5]} castShadow>
                    <cylinderGeometry args={[0.06, 0.04, 0.5]} />
                    <meshStandardMaterial color={skinColor} />
                </mesh>
                <mesh position={[-0.105, 0.21, 0]} rotation={[0, 0, 0.5]}>
                    <Capsule
                        args={[0.05, 0.05, 15, 32]} // [radius, length, capSegments, radialSegments]
                        castShadow
                    >
                        <meshStandardMaterial color={skinColor} />
                    </Capsule>
                </mesh>
            </group>

            {/* hands */}
            <mesh position={[-0.37, 0.7, 0]} castShadow>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>
            <mesh position={[0.37, 0.7, 0]} castShadow>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Pants */}
            <Pants style={pantsStyle} color={pantsColor} />

            {/* Legs */}
            <mesh position={[-0.09, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.06, 0.6]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>
            <mesh position={[0.09, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.06, 0.6]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Feet */}
            <mesh position={[-0.12, -0.1, 0]} scale={[0.25, 0.15, 0.4]} castShadow>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={feetColor} />
            </mesh>
            <mesh position={[0.12, -0.1, 0]} scale={[0.25, 0.15, 0.4]} castShadow>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={feetColor} />
            </mesh>
        </group>
    )
}
function Shirt({ style, color }: { style: string; color: string }) {
    switch (style) {
        case "tshirt":
            return (

                <group position={[0, 1, 0]}>
                    <mesh castShadow>
                        <Capsule
                            args={[0.2, 0.09, 15, 32]} // [radius, length, capSegments, radialSegments]
                            castShadow
                        >
                            <meshStandardMaterial color={color} />
                        </Capsule>
                    </mesh>
                    <mesh position={[0, -0.1, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.2, 0.2]} />
                        <meshStandardMaterial
                            roughness={10} color={color} />
                    </mesh>
                </group>
            )
        case "shirt":
            return (
                <group>
                    <mesh position={[0, 1, 0]} castShadow>
                        <cylinderGeometry args={[0.22, 0.18, 0.45]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "hoodie":
            return (
                <group>
                    <mesh position={[0, 0.9, 0]} castShadow>
                        <cylinderGeometry args={[0.22, 0.18, 0.6]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "tank":
            return (
                <mesh position={[0, 0.9, 0]} castShadow>
                    <cylinderGeometry args={[0.2, 0.16, 0.6]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            )
        case "jacket":
            return (
                <group>
                    <mesh position={[0, 0.9, 0]} castShadow>
                        <cylinderGeometry args={[0.24, 0.19, 0.6]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[0, 1.1, 0.18]} castShadow>
                        <boxGeometry args={[0.3, 0.2, 0.02]} />
                        <meshStandardMaterial color="#2c3e50" />
                    </mesh>
                </group>
            )
        default:
            return null
    }
}

function Pants({ style, color }: { style: string; color: string }) {
    switch (style) {
        case "jeans":
            return (
                <group>
                    <mesh position={[0.1, 0.4, 0]} castShadow>
                        <cylinderGeometry args={[0.11, 0.09, 0.6]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[-0.1, 0.4, 0]} castShadow>
                        <cylinderGeometry args={[0.11, 0.09, 0.6]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[0, 0.75, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "shorts":
            return (
                <group>
                    <mesh position={[0.1, 0.6, 0]} castShadow>
                        <cylinderGeometry args={[0.11, 0.1, 0.2]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[-0.1, 0.6, 0]} castShadow>
                        <cylinderGeometry args={[0.11, 0.1, 0.2]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[0, 0.75, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "cargo":
            return (
                <group>
                    <mesh position={[0.1, 0.35, 0]} castShadow>
                        <cylinderGeometry args={[0.1, 0.14, 0.7]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[-0.1, 0.35, 0]} castShadow>
                        <cylinderGeometry args={[0.1, 0.14, 0.7]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    <mesh position={[0, 0.75, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "skirt":
            return (
                <mesh position={[0, 0.6, 0]} castShadow>
                    <cylinderGeometry args={[0.13, 0.27, 0.4]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            )
        default:
            return null
    }
}

function Cap({ style, color }: { style: string; color: string }) {
    switch (style) {
        case "baseball":
            return (
                <group>
                    {/* Cap crown */}
                    <mesh position={[0, 1.65, 0]} castShadow>
                        <sphereGeometry args={[0.24, 16, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* Visor */}
                    <mesh position={[0, 1.66, 0.25]} rotation={[-0.2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.25, 0.2, 0.02, 16]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "tophat":
            return (
                <group>
                    {/* Hat brim */}
                    <mesh position={[0, 1.7, 0]} castShadow>
                        <cylinderGeometry args={[0.4, 0.4, 0.03]} />
                        <meshStandardMaterial color="#000000" />
                    </mesh>
                    {/* Hat crown */}
                    <mesh position={[0, 1.9, 0]} castShadow>
                        <cylinderGeometry args={[0.25, 0.25, 0.4]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* Hat band */}
                    <mesh position={[0, 1.75, 0]} castShadow>
                        <cylinderGeometry args={[0.26, 0.26, 0.05]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>
                </group>
            )
        case "cowboy":
            return (
                <group>
                    {/* Hat brim */}
                    <mesh position={[0, 1.67, 0]} rotation={[0, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.45, 0.35, 0.02]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* Hat crown */}
                    <mesh position={[0, 1.83, 0]} castShadow>
                        <cylinderGeometry args={[0.22, 0.25, 0.3]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* Crease */}
                    <mesh position={[0, 2.0, 0]} castShadow>
                        <boxGeometry args={[0.03, 0.1, 0.4]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>
            )
        case "crown":
            return (
                <group>
                    {/* Crown base */}
                    <mesh position={[0, 1.7, 0]} castShadow>
                        <cylinderGeometry args={[0.28, 0.3, 0.1]} />
                        <meshStandardMaterial color="#FFD700" />
                    </mesh>
                    {/* Crown points */}
                    <mesh position={[0, 1.82, 0.25]} castShadow>
                        <coneGeometry args={[0.05, 0.15]} />
                        <meshStandardMaterial color="#FFD700" />
                    </mesh>
                    <mesh position={[0.2, 1.82, 0]} castShadow>
                        <coneGeometry args={[0.05, 0.15]} />
                        <meshStandardMaterial color="#FFD700" />
                    </mesh>
                    <mesh position={[-0.2, 1.82, 0]} castShadow>
                        <coneGeometry args={[0.05, 0.15]} />
                        <meshStandardMaterial color="#FFD700" />
                    </mesh>
                    <mesh position={[0, 1.82, -0.25]} castShadow>
                        <coneGeometry args={[0.05, 0.15]} />
                        <meshStandardMaterial color="#FFD700" />
                    </mesh>
                    {/* Jewels */}
                    <mesh position={[0, 1.82, 0.28]} castShadow>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshStandardMaterial color="#FF0000" />
                    </mesh>
                </group>
            )
        case "fedora":
            return (
                <group>
                    {/* Hat brim */}
                    <mesh position={[0, 1.65, 0]} castShadow>
                        <cylinderGeometry args={[0.38, 0.32, 0.02]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* Hat crown */}
                    <mesh position={[0, 1.8, 0]} castShadow>
                        <cylinderGeometry args={[0.24, 0.26, 0.25]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* Hat band */}
                    <mesh position={[0, 1.7, 0]} castShadow>
                        <cylinderGeometry args={[0.27, 0.27, 0.03]} />
                        <meshStandardMaterial color="#654321" />
                    </mesh>
                </group>
            )
        case "chef":
            return (
                <mesh position={[0, 1.9, 0]} castShadow>
                    <cylinderGeometry args={[0.30, 0.25, 0.5]} />
                    <meshStandardMaterial color="#FFFFFF" />
                </mesh>
            )
        default:
            return "baseball"
    }
}
