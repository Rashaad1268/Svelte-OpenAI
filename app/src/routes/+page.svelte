<script>
	let input = '';

    async function submit() {
        if (!input) {
            alert("Please give an input");
            return;
        };

        const response = await fetch('/api/write', {
			method: 'POST',
			body: JSON.stringify({ temperature: 1, max_tokens: 500, prompt: input.trim() }),
			headers: {
				'content-type': 'application/json'
			}
		});

		// @ts-ignore
		const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        if (!input.endsWith("\n\n")) {
            input += "\n\n";
        }

        while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			const data = value
				.trim()
				.replace('data: ', '')
				.replace(/[^\x00-\xFF]/g, '')
				.split('\n\n');

			if (!data.includes('[DONE]')) {
				data.forEach((i) => {
                    i = i
						.trim()
						.replace('data: ', '')
						.replace(/[^\x00-\xFF]/g, '');
					console.log(i);

                    if (i.toUpperCase() === "[DONE]") {
                        return;
                    }

                    try {
						input += JSON.parse(i).choices[0].text;
					} catch (error) {
						console.error(error);
						console.log('JSON DATA FOR ERR:', i);
					}
				});
			} else {
				console.log('Done');
			}
		}
	}
</script>

<div class="main-container">
    <div class="flex flex-col gap-5 mb-20">
        <textarea bind:value={input} />

        <div class="self-start">
            <button on:click={submit} class="btn btn-green">Submit</button>
            <button on:click={() => input = ""} class="btn btn-red">Clear</button>
        </div>
    </div>
</div>


<style lang="postcss">
    .main-container {
        @apply mx-2;
    }
	textarea {
        @apply resize-none outline-none h-[50vh]
               border border-neutral-400 rounded-sm
               p-3 mt-2;
	}

    .btn {
        @apply bg-gray-500 text-white rounded-[3px];

        font-size: 14px;
        line-height: 20px;
        padding: 6px 12px;
        padding-top: 6px;
        padding-right: 12px;
        padding-bottom: 6px;
        padding-left: 12px;
    }
    .btn:hover {
        @apply bg-gray-600;
    }
    .btn:active {
        @apply bg-gray-700;
    }

    .btn-green {
        @apply bg-[#10a37f];
    }
    .btn-green:hover {
        @apply bg-[#1a7f64];
    }
    .btn-green:active {
        @apply bg-[#1b5d4a];
    }

    .btn-red {
        @apply bg-red-500;
    }
    .btn-red:hover {
        @apply bg-red-600;
    }
    .btn-red:active {
        @apply bg-red-700;
    }
</style>
