import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import React, { useState } from "react";

import {
	Container,
	Button,
	Input,
	Spacer,
	Text,
	Link,
	Textarea,
} from "@nextui-org/react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [generatedText, setGeneratedText] = useState("");
	const [inputText, setInputText] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await axios.get(
			`/api/accio?accio_spell_text=${inputText}`
		);
		setGeneratedText(response.data.generatedText);
	};
	return (
		<>
			<Head>
				<title>accio.how - Lazy but smart</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div>
				<h1 className="p-10 text-3xl font-bold">This is accio.how</h1>

				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={inputText}
						onChange={(event) => setInputText(event.target.value)}
					/>
					<button type="submit">Submit</button>
				</form>
				<p>{generatedText}</p>
			</div>
		</>
	);
}
