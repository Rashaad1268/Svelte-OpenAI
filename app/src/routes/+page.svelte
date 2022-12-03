<script>
    let input = "";
    let output = "";

    async function submit() {
        const response = await fetch('/api/write', {
            method: 'POST',
            body: JSON.stringify({ temperature: 1, max_tokens: 500, prompt: input }),
            headers: {
                'content-type': 'application/json'
            }
        });

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        while (true) {
            const {value, done} = await reader.read();
            if (done) break;

            const data = value.trim().replace("data: ", "").replace(/[^\x00-\xFF]/g, "").split("\n\n");

            if (!data.includes("[DONE]")) {
                data.forEach((i) => {
                    i = i.trim().replace("data: ", "").replace(/[^\x00-\xFF]/g, "");
                    console.log(i)
                    try {
                        output += JSON.parse(i).choices[0].text
                    } catch (error) {
                        console.log("error", error);
                        console.log("JSON DATA FOR ERR:", i)
                    }
                })
            } else {
                console.log("Done")
            }
        }
    }
</script>

<textarea bind:value={input} />

<button on:click={submit}>Click</button>


<h3>Output:</h3>

<p>{output ? output : "None"}</p>


<style>
    textarea {
        width: 50%;
        height: 200px;
    }
</style>