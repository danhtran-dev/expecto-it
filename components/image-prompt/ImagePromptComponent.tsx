import React, { useEffect, useState } from "react";
import { Button, Card, Container, Input, Loading, Spacer, Tooltip, Image } from "@nextui-org/react";
import axios from "axios";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { SendIcon } from "../SendIcon";
import { IoCopy } from "react-icons/io5";
import { RiBugLine } from "react-icons/ri";
import { RingSpinner, WhisperSpinner } from "react-spinners-kit";
import { TypeAnimation } from "react-type-animation";

const MAX_SPELL = 256;

interface ImagePromptComponentProps {
    textPrompt: string;
    textResult?: string;
    className?: string;
}

const ImagePromptComponent: React.FC<ImagePromptComponentProps> = ({
    textPrompt,
    textResult,
    className,
}) => {
    const [loading, setLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const [generatedImage, setGeneratedImage] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        const response = await axios.get(`/api/expecto-image?expecto_it=${inputText}`);
        setGeneratedImage(response.data.imgUrl);
        setLoading(false);
    };
    const handleCopy = () => {};

    const handleReportBug = () => {
        window.open("https://forms.gle/xp1WATtqCXp5LBS96", "_blank");
    };
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textPrompt) {
            setInputText(textPrompt);
        }
        if (inputRef.current != null) {
            inputRef.current.value = textPrompt;
        }
    }, [textResult, textPrompt]);

    return (
        <Container className={className}>
            <div className="flex justify-center w-full mx-auto">
                <div className="w-full">
                    <Input
                        ref={inputRef}
                        aria-label="input-prompt-text"
                        readOnly={loading ? true : false}
                        bordered={false}
                        animated={true}
                        shadow={true}
                        size="lg"
                        width="100%"
                        color="primary"
                        maxLength={MAX_SPELL}
                        onChange={(event) => {
                            const newInputText = event.target.value;
                            if (event.target.value.length <= MAX_SPELL) {
                                setInputText(newInputText);
                            } else {
                                setInputText(newInputText.substring(0, MAX_SPELL));
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key == "Enter") {
                                handleSubmit();
                            }
                        }}
                        placeholder="Type in the power of Expecto.it"
                    />
                </div>

                <Spacer x={0.3} />
                <Button
                    shadow={true}
                    animated={true}
                    auto={true}
                    color="primary"
                    onClick={handleSubmit}
                >
                    <div style={{ width: 35, height: 35 }}>
                        {loading ? (
                            <Loading type="points" color="currentColor" />
                        ) : (
                            // create the div that child items will draw on over others
                            <CircularProgressbarWithChildren
                                strokeWidth={5}
                                value={(inputText.length * 100) / MAX_SPELL}
                                styles={buildStyles({
                                    pathColor: `rgba(171, 196, 255, ${1})`,
                                    trailColor: `rgba(255, 255, 255, ${
                                        (inputText.length * 100) / MAX_SPELL / 100
                                    })`,
                                })}
                            >
                                <SendIcon />
                            </CircularProgressbarWithChildren>
                        )}
                    </div>
                </Button>
            </div>

            <Spacer y={0.5} />
            <Card
                className="shadow hover:shadow-2xl"
                isHoverable={true}
                isPressable={false}
                variant="bordered"
                borderWeight={"light"}
            >
                <div className="ml-5 mr-5 mt-2">
                    {inputText.length == 0 ? (
                        <div>
                            <div className="flex justify-center w-full mx-auto bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-500 mr-1">
                                <TypeAnimation
                                    sequence={[
                                        "Expecto is a powerful spell that summons everything from the Internet",
                                    ]}
                                    wrapper="h3"
                                    speed={69}
                                    cursor={false}
                                    repeat={1}
                                />
                            </div>
                            <div className="flex justify-center w-full mx-auto">
                                <RingSpinner size={24} color="rgba(171, 196, 255, 1)" />
                            </div>
                        </div>
                    ) : loading ? (
                        <div>
                            <div className="flex justify-center w-full mx-auto bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-orange-600">
                                <TypeAnimation
                                    sequence={["Stay tune!!! Magic is happening ..."]}
                                    wrapper="h3"
                                    speed={36}
                                    cursor={false}
                                    repeat={1}
                                />
                            </div>
                            <div className="flex justify-center w-full mx-auto ">
                                <WhisperSpinner size={24} />
                            </div>
                        </div>
                    ) : (
                        generatedImage.split("\n").map((text, idx) => (
                            <div
                                className="w-full mx-auto bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-600"
                                key={idx}
                            >
                                <Image width={1024} height={1024} alt="Image from AI" src={text} />
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end pb-1 pr-1 pt-1">
                    <Tooltip content="Report a bug" placement="top">
                        <Button className="mx-1" size={"xs"} auto={true} onClick={handleReportBug}>
                            <RiBugLine />
                        </Button>
                    </Tooltip>

                    <Tooltip content="Copy to clipboard" placement="top">
                        <Button className="mx-0" size={"xs"} auto={true} onClick={handleCopy}>
                            <IoCopy></IoCopy>
                        </Button>
                    </Tooltip>
                </div>
            </Card>
        </Container>
    );
};

export default ImagePromptComponent;
