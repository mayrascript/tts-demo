"use client";
import {useEffect, useMemo, useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
interface IFormInput {
    textToSpeech: string;
    rate: number;
    pitch: number;
    voice: string;
}
export default function Home() {
    const form = useForm<IFormInput>(
        {
            defaultValues: {
                textToSpeech: "",
                rate: 1,
                pitch: 1,
                voice: ''
            },
        }
    )

    const [synth, setSynth] = useState<SpeechSynthesis>();
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);


    useEffect(() => {
        const synth = window.speechSynthesis;
        if(synth) {
            setSynth(synth)
        }

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                const voices = speechSynthesis.getVoices();
                setVoices(voices)
            }
        }
    }, [])

    const onSubmit: SubmitHandler<IFormInput> = ({textToSpeech, rate, pitch, voice}) => {
        const utterance = new SpeechSynthesisUtterance();
        const selectedVoice = voices.find(v => v.name === voice)
        utterance.voice = selectedVoice || null;
        utterance.volume = 1;
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.text = textToSpeech;
        if(synth) {
            synth.speak(utterance);
        }
    }


    return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Speech synthesizer</h1>

          <p>
            Enter some text in the input below and press Play to hear it. change voices
            using the dropdown menu.
          </p>


        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="textToSpeech"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Rate</FormLabel>
                            <FormControl>
                                <Input type="textarea" placeholder="Text to Speech" min="0.5" max="2" step="0.1"
                                       id="rate" {...form.register("textToSpeech")} />
                            </FormControl>
                            <FormDescription>This is the text you want to Speech.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Rate</FormLabel>
                            <FormControl>
                                <Input type="range" placeholder="Rate" {...form.register("rate")} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pitch"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Pitch</FormLabel>
                            <FormControl>
                                <Input type="range" placeholder="Pitch" min="0" max="2" step="0.1"
                                       id="pitch" {...form.register("pitch")} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="voice"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a voice"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {voices.map(voice => (
                                        <SelectItem key={voice.name} value={voice.name}>{voice.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Voices for the Text to Speech
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Play</Button>
            </form>
        </Form>
    </main>
);
}
