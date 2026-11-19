window.FRSI = {
 "categories": [
  {
   "id": "pretrain",
   "name": "Pre-training",
   "blurb": "Optimizers, objectives, architectures and training of draft models, scored on held-out loss or latency."
  },
  {
   "id": "posttrain",
   "name": "Agentic post-train and harness",
   "blurb": "Design RL data that teaches a small model multi-step coding, or improve the harness around a fixed worker model."
  },
  {
   "id": "inference",
   "name": "Inference and serving",
   "blurb": "Scheduling, routing, caching and batching for frozen-model serving, with exact greedy outputs."
  },
  {
   "id": "kernels",
   "name": "GPU kernels",
   "blurb": "Fast, numerically correct H100 kernels for attention, matrix products and sampling."
  }
 ],
 "tasks": [
  {
   "id": "model-shape-efficiency",
   "category": "pretrain",
   "title": "Choose a transformer shape",
   "desc": "Pick transformer dimensions that minimize decode time for a fixed workload while meeting accuracy limits.",
   "metric": "total decode time (ms)",
   "digits": 1,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 624.815046349795,
   "best_model": "GPT-6.1 Sol",
   "nop": {
    "reward": 0.0,
    "raw": 11406.158778999998,
    "status": "success"
   },
   "summary": {
    "goal": "Choose dimensions for the supplied transformer to minimize the total decode time, in milliseconds, to generate 32,768 tokens on one 80 GB H100 across 16 requests, each a batch of eight 1,024-token prompts generating 256 tokens per sequence.",
    "handin": "Edit `configure(defaults)` in /app/submission/candidate.py so it returns the same dictionary keys with integer dimensions allowed by `checked_config`, and keep the other starter functions unchanged.",
    "rules": [
     "The model must have at most 150 million parameters and use at most 64 GiB of peak GPU memory.",
     "The trained model's mean next-token loss must stay within 0.05 nats/token of the supplied baseline on unseen text.",
     "Each full training run gets 30 minutes, including loading, compilation, training and checkpoint export, and the checkpoint must load and produce finite outputs."
    ],
    "scoring": "The result is the sum of decode times after warm-up and prompt prefill, using CUDA graph replay, averaged over two independent seeds with ten warmed workload repetitions each."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": null,
       "status": "failed"
      },
      {
       "reward": 1.0,
       "raw": 624.815046349795,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": null,
       "status": "failed"
      },
      {
       "reward": 0.5878509193738739,
       "raw": 653.4280404513993,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.29392545968693695
    },
    {
     "trials": [
      {
       "reward": 0.5239630777237041,
       "raw": 657.8633832004925,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 749.0977155507608,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.26198153886185205
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 858.9328642545297,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 725.318879048973,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1060.3607349998128,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1026.4966454501518,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 716.8928384493483,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 812.4902357485553,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 717.5898646488349,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 823.8729194006737,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 789.2685047982923,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1122.3145108009703,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 11114.954400751049,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 792.5179125011709,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "language-model-optimizer",
   "category": "pretrain",
   "title": "Design the optimizer",
   "desc": "Improve the parameter-update rule for a language model trained from scratch, to minimize held-out next-token loss.",
   "metric": "held-out loss (nats/token)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 4.125242555379501,
   "best_model": "Gemini 4 Carbon",
   "nop": {
    "reward": 0.0,
    "raw": 6.57335877357479,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize final next-token validation loss, in nats per token, by improving the supplied parameter-update (optimizer) implementation for a fixed 125M-parameter GPT trained on a 100M-token FineWeb pool.",
    "handin": "Edit only /app/submission/candidate.py (at most 256 KiB) and keep the public `optimizer` entry point and its signature.",
    "rules": [
     "Do not change the fixed model architecture, data/evaluation logic, numerical contract, or resource limits.",
     "Each run must train from the supplied initialization and export a usable checkpoint within 1,800 seconds, including loading, compilation and data preparation.",
     "Peak GPU memory must stay within 64 GiB, and output tensors must be finite.",
     "Final-evaluation items may not be used for training or checkpoint selection."
    ],
    "scoring": "The submitted code trains from scratch in two independent 30-minute runs with different seeds, and the result is the mean held-out next-token loss of the two runs."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 4.125242555379501,
       "status": "success"
      },
      {
       "reward": 0.9471186545744583,
       "raw": 4.149481263883408,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.9735593272872292
    },
    {
     "trials": [
      {
       "reward": 0.9274686551515361,
       "raw": 4.158488043198144,
       "status": "success"
      },
      {
       "reward": 0.902336674394555,
       "raw": 4.1700075450336636,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.9149026647730456
    },
    {
     "trials": [
      {
       "reward": 0.9206712709780537,
       "raw": 4.16160369413789,
       "status": "success"
      },
      {
       "reward": 0.8940154246494033,
       "raw": 4.1738216754295125,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.9073433478137285
    },
    {
     "trials": [
      {
       "reward": 0.9444049405718833,
       "raw": 4.150725122604136,
       "status": "success"
      },
      {
       "reward": 0.8362850287394175,
       "raw": 4.200282996090266,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.8903449846556504
    },
    {
     "trials": [
      {
       "reward": 0.8937537964683366,
       "raw": 4.173941595396871,
       "status": "success"
      },
      {
       "reward": 0.799638664482026,
       "raw": 4.217080234016325,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.8466962304751813
    },
    {
     "trials": [
      {
       "reward": 0.8842542104260332,
       "raw": 4.178295828352448,
       "status": "success"
      },
      {
       "reward": 0.7940209456253913,
       "raw": 4.219655173226497,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.8391375780257122
    },
    {
     "trials": [
      {
       "reward": 0.8443750920456831,
       "raw": 4.196574832376186,
       "status": "success"
      },
      {
       "reward": 0.7222619567126928,
       "raw": 4.252546643759127,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.7833185243791879
    },
    {
     "trials": [
      {
       "reward": 0.670651496494408,
       "raw": 4.276202828958592,
       "status": "success"
      },
      {
       "reward": 0.7913945888333273,
       "raw": 4.220858990871411,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.7310230426638676
    },
    {
     "trials": [
      {
       "reward": 0.9251322521051607,
       "raw": 4.159558957561858,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.46256612605258035
    }
   ]
  },
  {
   "id": "training-objective-design",
   "category": "pretrain",
   "title": "Design the training objective",
   "desc": "Improve the training computation and objective of a fixed architecture, to minimize held-out next-token loss.",
   "metric": "held-out loss (nats/token)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 4.2501733916512645,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": 6.080782386625478,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize final next-token validation loss, in nats per token, by improving the training computation and objective for a fixed 125M-parameter GPT trained on a 100M-token FineWeb pool, while exporting the unchanged deployed architecture.",
    "handin": "Edit only /app/submission/candidate.py (at most 256 KiB) and keep the `configure` and `training_loss` entry points, where `configure` declares up to 64 auxiliary tensors and `training_loss` returns one finite scalar loss.",
    "rules": [
     "Total training parameters, including the fixed model and all auxiliary tensors, must be at most 250M.",
     "The runner owns initialization, AdamW, backward, clipping and export; hooks use only the stateless numerical API, with no module or optimizer access, closures, or lambdas.",
     "Each of the two runs has 1,800 seconds, including all training-only computation, and peak GPU memory must stay within 64 GiB.",
     "Held-out evaluation items may not be used for training or checkpoint selection."
    ],
    "scoring": "The submitted code trains from scratch in two independent 30-minute runs with different seeds, and the result is the mean held-out next-token loss of the two runs."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.7284353209006083,
       "raw": 4.378417499786881,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 4.2501733916512645,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.8642176604503041
    },
    {
     "trials": [
      {
       "reward": 0.38043951525075126,
       "raw": 4.542755556851244,
       "status": "success"
      },
      {
       "reward": 0.49020936167239937,
       "raw": 4.490917681243807,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.4353244384615753
    },
    {
     "trials": [
      {
       "reward": 0.4117130193743395,
       "raw": 4.527986910730158,
       "status": "success"
      },
      {
       "reward": 0.3792212479533423,
       "raw": 4.543330873212507,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.3954671336638409
    },
    {
     "trials": [
      {
       "reward": 0.7432166265840994,
       "raw": 4.371437153996899,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 5.573669674392852,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.3716083132920497
    },
    {
     "trials": [
      {
       "reward": 0.2586702365500547,
       "raw": 4.600260062212829,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.7895100646548805,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.12933511827502736
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 6.0462397475518515,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 5.4201356598614305,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 6.10154740064497,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 5.332533201741611,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.689751655946801,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 5.4447337020316375,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.833323731644606,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 5.69361322718404,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "long-sequence-computation",
   "category": "pretrain",
   "title": "Speed up long-context attention",
   "desc": "Cut full-forward latency on 2K to 16K-token contexts while preserving causal attention and model quality.",
   "metric": "full-forward latency (ms)",
   "digits": 2,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 13.720738563260682,
   "best_model": "Gemini 4 Argon",
   "nop": {
    "reward": 0.0,
    "raw": 212.9993784414122,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize full-forward latency, in milliseconds per pass, of causal attention in the supplied 125M-parameter backbone on one 80 GB H100, for contexts of 2,048, 4,096, 8,192 and 16,384 tokens.",
    "handin": "Edit only `mix(q,k,v,state,offset,layer,extra)` in /app/submission/candidate.py, returning an output with the same shape as `q` and carrying any state explicitly as tensors, and keep the other starter functions intact.",
    "rules": [
     "`mix` must stay within 0.08 relative error of the supplied causal attention during prefill and with a 16,384-token history, and future tokens may change an earlier logit by at most 0.01.",
     "The trained model's mean next-token loss must stay within 0.05 nats/token of the supplied baseline on unseen text.",
     "Peak GPU memory must stay within 64 GiB, including all storage reachable from the returned state.",
     "Only the listed tensor and math APIs are allowed; file and process access, reflection, persistent globals, hidden state and timers are not."
    ],
    "scoring": "Latency is the median warmed full-forward time per input window, with each context length weighted equally, averaged over two independent seeds with ten warmed workload repetitions each."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 13.720738563260682,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 22.8349210867016,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 49.19965509376425,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 47.93691270078142,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 213.0040407468769,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 46.29677356796975,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 41.72428093201361,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 49.20805756564164,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 367.10420737264474,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 48.95162796328876,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 48.66225083361968,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 114.98070464687018,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 69.58578547340792,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 51.838176259340685,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 44.79580668121699,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 124.32739302421325,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 53.118540663260916,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "speculative-draft-training",
   "category": "pretrain",
   "title": "Train a speculative draft model",
   "desc": "Train a small proposal model in 30 minutes that speeds up exact greedy decoding of frozen Qwen3-8B.",
   "metric": "decode time (ms/token)",
   "digits": 2,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 9.878943214035342,
   "best_model": "Claude Fable 5.2",
   "nop": {
    "reward": 0.0,
    "raw": 18.950359021643767,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize decode time, in milliseconds per generated token, of the frozen Qwen3-8B model on one H100 80GB by training a small proposal (draft) model whose proposed tokens are checked by a fixed decoder.",
    "handin": "Submit /app/submission/train.py (at most 256 KiB), run as `python -I /app/submission/train.py --seconds 1800 --seed INTEGER --out DIRECTORY`, which must write `architecture.json` and `weights.safetensors` to the output directory.",
    "rules": [
     "Every returned sequence must match ordinary greedy generation from the target model.",
     "Training must exit successfully within 1,800 seconds and start from random proposal weights, with no pretrained proposal weights or external downloads.",
     "The proposal model may have at most 600 million trainable parameters, and peak GPU process memory must stay within 72 GiB.",
     "The proposal must use the supported architecture format: 1 to 4 MLP or causal attention blocks, with 1 to 8 proposed tokens per step."
    ],
    "scoring": "Training is repeated with two seeds, each proposal model is evaluated on the same 100 prompts (conversations and code) generating up to 256 tokens each, and latency is total timed decode milliseconds divided by decoded tokens, averaged over the two seeds."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 9.878943214035342,
       "status": "success"
      },
      {
       "reward": 0.442716125608686,
       "raw": 10.490651630614163,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.721358062804343
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 11.749821680431344,
       "status": "success"
      },
      {
       "reward": 0.8011857311222074,
       "raw": 10.097173755411305,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.4005928655611037
    },
    {
     "trials": [
      {
       "reward": 0.26255801323773054,
       "raw": 10.688404048576437,
       "status": "success"
      },
      {
       "reward": 0.1104603978681606,
       "raw": 10.855355571379345,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.18650920555294556
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 12.172055073189465,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 11.733722678701714,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 15.239912853457728,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 15.739152130858457,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 14.428284977156093,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 14.032700651444225,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 11.59960492355593,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 19.72153553869014,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 11.200205589971642,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 17.889348011127318,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 22.58439698895429,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 13.291146604474712,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "pt-multifile-numpy-rl-qwen3-4b",
   "category": "posttrain",
   "title": "RL data: NumPy bug fixing",
   "desc": "Design RL training data so that a fixed GRPO run teaches Qwen3-4B to fix bugs in multi-file NumPy projects.",
   "metric": "hidden projects solved",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.6333,
   "best_model": "GPT-6 Astra",
   "nop": {
    "reward": 0.0,
    "raw": 0.43,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen projects that Qwen3-4B solves after reinforcement learning on the agent's training data, where each project is a small multi-file Python project whose functions use NumPy, with bugs to fix using tools.",
    "handin": "Training projects in /app/rl_pool/pool.jsonl, in the format of the sample projects (files, hidden tests, tool-call budget, with libs and rel_tol fixed to [\"numpy\"] and 1e-07), plus optional training settings in /app/rl_pool/config.json.",
    "rules": [
     "The original model is trained on the hand-in by a fixed GRPO run of at most 2 hours on one H100. The agent does not train the final model itself.",
     "The algorithm, LoRA setup, episode loop and 0/1 reward are fixed. Only the training settings in config.json can be chosen.",
     "Do not use another language model to produce training data. Data and programs the agent writes itself are allowed.",
     "Only /app/rl_pool/pool.jsonl and /app/rl_pool/config.json are kept after the 8-hour session."
    ],
    "scoring": "The trained model works greedily on new NumPy projects from the same distribution as the samples, and a project counts as solved only if every function passes its hidden tests."
   },
   "hours": 8.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 0.6333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4033,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.8957839886309815,
       "raw": 0.6267,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5667,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.44789199431549076
    },
    {
     "trials": [
      {
       "reward": 0.1583767566714035,
       "raw": 0.58,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4967,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.07918837833570175
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.48,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.4467,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3567,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5433,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4133,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5533,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3633,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.56,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4433,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2467,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.25,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "pt-multifile-scipy-rl-qwen3-4b",
   "category": "posttrain",
   "title": "RL data: SciPy bug fixing",
   "desc": "Design RL training data so that a fixed GRPO run teaches Qwen3-4B to fix bugs in multi-file SciPy projects.",
   "metric": "hidden projects solved",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.8333,
   "best_model": "Kimi K3.1 Pro",
   "nop": {
    "reward": 0.0,
    "raw": 0.3667,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen projects that Qwen3-4B solves after reinforcement learning on the agent's training data, where each project is a small multi-file Python project whose functions use SciPy, with bugs to fix using tools.",
    "handin": "Training projects in /app/rl_pool/pool.jsonl, in the format of the sample projects (files, hidden tests, tool-call budget, with libs and rel_tol fixed to [\"scipy\"] and 1e-07), plus optional training settings in /app/rl_pool/config.json.",
    "rules": [
     "The original model is trained on the hand-in by a fixed GRPO run of at most 2 hours on one H100. The agent does not train the final model itself.",
     "The algorithm, LoRA setup, episode loop and 0/1 reward are fixed. Only the training settings in config.json can be chosen.",
     "Do not use another language model to produce training data. Data and programs the agent writes itself are allowed.",
     "Only /app/rl_pool/pool.jsonl and /app/rl_pool/config.json are kept after the 8-hour session."
    ],
    "scoring": "The trained model works greedily on new SciPy projects from the same distribution as the samples, and a project counts as solved only if every function passes its hidden tests."
   },
   "hours": 8.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 0.8333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.54,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.7267,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5867,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6767,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5767,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6633,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.1867,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.17,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.42,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.4633,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3633,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3733,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.39,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.25,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4933,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.4267,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.29,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "pt-chained-rl-qwen3-4b",
   "category": "posttrain",
   "title": "RL data: chained bugs",
   "desc": "Design RL training data that teaches Qwen3-4B to find and fix bugs that only show up one after another, over many tool calls.",
   "metric": "hidden projects solved",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.4967,
   "best_model": "Gemini 4 Argon",
   "nop": {
    "reward": 0.0,
    "raw": 0.1067,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen projects that Qwen3-4B solves after reinforcement learning on the agent's training data, where each project is a multi-file Python pipeline with a chain of 1 to 4 bugs: the tests show only the first failure, and each fixed bug reveals the next one.",
    "handin": "Training projects in /app/rl_pool/pool.jsonl, in the format of the sample projects (files, hidden tests, tool-call budget, optional graded: \"api\"), plus optional training settings in /app/rl_pool/config.json.",
    "rules": [
     "The original model is trained on the hand-in by a fixed GRPO run of at most 2 hours on one H100. The agent does not train the final model itself.",
     "The algorithm, LoRA setup, episode loop and 0/1 reward are fixed. Only the training settings in config.json can be chosen.",
     "Only /app/rl_pool/pool.jsonl and /app/rl_pool/config.json are kept after the session, and /app/rl_pool/ must not change after the session ends.",
     "The session lasts 8 hours on one H100 GPU with 80 GB of memory, with no internet access."
    ],
    "scoring": "The trained model works greedily on new chained-bug projects, each a different program on its own subject, and a project counts as solved only if every tested function passes its hidden tests."
   },
   "hours": 8.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3933,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 0.4967,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.1667,
       "status": "success"
      },
      {
       "reward": 0.32756190859673867,
       "raw": 0.4633,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.16378095429836934
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2867,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.2333,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.1867,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.1133,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.0333,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.1867,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.0067,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.26,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "failed"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.1133,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.1333,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.15,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.09,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "pt-interfaceport-easy-rl-qwen3-4b",
   "category": "posttrain",
   "title": "RL data: interface porting",
   "desc": "Design RL training data that teaches Qwen3-4B to update callers after a module is rewritten to a new interface.",
   "metric": "hidden projects solved",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.43,
   "best_model": "GPT-6 Astra",
   "nop": {
    "reward": 0.0,
    "raw": 0.3167,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen projects that Qwen3-4B solves after reinforcement learning on the agent's training data, where each project is a multi-file Python project in which a module was rewritten to a new interface and one caller function still uses the old one.",
    "handin": "Training projects in /app/rl_pool/pool.jsonl, in the format of the sample projects (files, hidden tests, tool-call budget, optional task: \"port\" with interface, or \"implement\"), plus optional training settings in /app/rl_pool/config.json.",
    "rules": [
     "The original model is trained on the hand-in by a fixed GRPO run of at most 2 hours on one H100. The agent does not train the final model itself.",
     "The algorithm, LoRA setup, episode loop and 0/1 reward are fixed. Only the training settings in config.json can be chosen.",
     "Do not use another language model to produce training data. Data and programs the agent writes itself are allowed.",
     "Only /app/rl_pool/pool.jsonl and /app/rl_pool/config.json are kept after the 8-hour session."
    ],
    "scoring": "The trained model works greedily on 300 new interface-port projects, and a project counts as solved only if every tested function returns the value its docstring gives on all hidden test inputs."
   },
   "hours": 8.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 0.43,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 0.43,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3433,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.6906976744186051,
       "raw": 0.4167,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.0733,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.34534883720930254
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2933,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3233,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3067,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3433,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3167,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.33,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3333,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "pt-multifile-rl-qwen3-4b",
   "category": "posttrain",
   "title": "RL data: multi-file bug fixing",
   "desc": "Design RL training data so that a fixed GRPO run teaches Qwen3-4B to fix bugs in multi-file Python projects with tools.",
   "metric": "hidden projects solved",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.8267,
   "best_model": "Grok 4.7",
   "nop": {
    "reward": 0.0,
    "raw": 0.5433,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen projects that Qwen3-4B solves after reinforcement learning on the agent's training data, where each project is a small multi-file Python project with bugs to fix using tools.",
    "handin": "Training projects in /app/rl_pool/pool.jsonl, in the format of the sample projects (files, hidden tests, tool-call budget), plus optional training settings in /app/rl_pool/config.json.",
    "rules": [
     "The original model is trained on the hand-in by a fixed GRPO run of at most 2 hours on one H100. The agent does not train the final model itself.",
     "The algorithm, LoRA setup, episode loop and 0/1 reward are fixed. Only settings such as steps, batch size, generations, temperature, learning rate and a sampling schedule can be chosen.",
     "Only /app/rl_pool/pool.jsonl and /app/rl_pool/config.json are kept after the session, and /app/rl_pool/ must not change after the session ends.",
     "The session lasts 8 hours on one H100 GPU with 80 GB of memory, with no internet access."
    ],
    "scoring": "The trained model works greedily on new projects from the same distribution as the samples, and a project counts as solved only if every function passes its hidden tests."
   },
   "hours": 8.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.6770291520503213,
       "raw": 0.8,
       "status": "success"
      },
      {
       "reward": 0.4750211685012703,
       "raw": 0.7833,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5760251602757958
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6333,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 0.8267,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.8790371355993709,
       "raw": 0.8167,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.1467,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.43951856779968546
    },
    {
     "trials": [
      {
       "reward": 0.31414055884843406,
       "raw": 0.77,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.0867,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.15707027942421703
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6033,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.62,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6567,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.6867,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6267,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.6133,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.6233,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.6367,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.66,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.6467,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "bfcl-harness",
   "category": "posttrain",
   "title": "Harness: BFCL v4 multi-turn",
   "desc": "Improve a reusable function-calling harness so a fixed worker model succeeds on unseen multi-turn BFCL v4 conversations.",
   "metric": "held-out success",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.6666666666666666,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": 0.0,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen BFCL v4 multi-turn function-calling conversations, over stateful simulated APIs, that a fixed worker model (Qwen3-Coder-30B-A3B-Instruct) completes when driven by the agent's harness.",
    "handin": "One frozen reusable harness in /app/harness.py, frozen with python /app/probe.py freeze and run without cross-case memory on unseen conversations.",
    "rules": [
     "Model weights, workload environments and the scoring procedure stay fixed. Do not access held-out cases or their answers, use unmetered inference or contact the internet.",
     "The harness must be general, not per-case solutions or a selector over supplied answers. A conversation counts only if the harness called the worker in that episode.",
     "Per-workload caps: 64 worker calls, 262144 total tokens, 32768 context tokens, 4096 output tokens per call, 128 tool executions of at most 30 seconds each and 600 wall seconds.",
     "Research budget: four hours, at most 24 development episodes and 6,291,456 reserved worker tokens. The harness must not be edited after freezing."
    ],
    "scoring": "The official BFCL checker checks each held-out conversation, and only conversations solved completely count."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "A100-80",
   "models": [
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5416666666666666,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 0.6666666666666666,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5833333333333334,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.16666666666666666,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.125,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5416666666666666,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.25,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.20833333333333334,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5416666666666666,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "swe-bench-harness",
   "category": "posttrain",
   "title": "Harness: SWE-bench Verified",
   "desc": "Improve a reusable repository-repair harness so a fixed worker model resolves unseen SWE-bench Verified issues.",
   "metric": "held-out success",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.6666666666666666,
   "best_model": "Claude Fable 5.2",
   "nop": {
    "reward": 0.0,
    "raw": 0.0,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen GitHub issues from SWE-bench Verified Python repositories that a fixed worker model (Qwen3-Coder-30B-A3B-Instruct) resolves when driven by the agent's harness.",
    "handin": "One frozen reusable harness in /app/harness.py that drives the worker, which gets the issue text and a bash tool in the instance's container with the repository at /testbed.",
    "rules": [
     "Model weights, workload environments and the success criterion stay fixed. Do not access held-out cases or their answers, use unmetered inference or contact the internet.",
     "Fixes belong in the library source. An issue counts as unresolved if the final tree adds, edits or deletes test infrastructure such as conftest.py, pytest.ini, tox.ini, setup.cfg, pyproject.toml or pytest hooks.",
     "Per-workload caps: 64 worker calls, 262144 total tokens, 32768 context tokens, 4096 output tokens per call, 128 tool executions of 120 seconds each and 1200 wall seconds.",
     "Research budget: four hours, at most 24 development episodes and 6,291,456 reserved worker tokens."
    ],
    "scoring": "An unseen issue counts as resolved only when all of its hidden tests pass on a fresh checkout with the worker's changes applied, within 600 seconds. These are the tests the fix should make pass and the existing tests that must keep passing."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "A100-80",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 0.6666666666666666,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5833333333333334,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3333333333333333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.16666666666666666,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3333333333333333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.16666666666666666,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5833333333333334,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.3333333333333333,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.5,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.5833333333333334,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.0,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.0,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.08333333333333333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.16666666666666666,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.25,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.0,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.0,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "webarena-verified-harness",
   "category": "posttrain",
   "title": "Harness: WebArena-Verified",
   "desc": "Improve a reusable web-agent harness so a fixed worker model completes unseen tasks on self-hosted websites.",
   "metric": "held-out success",
   "digits": 3,
   "percent": true,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 0.5,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": 0.0,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize the share of unseen tasks on self-hosted shopping, shop-administration and forum websites that a fixed worker model (Qwen3-Coder-30B-A3B-Instruct) completes by driving a real browser through the agent's harness.",
    "handin": "One frozen reusable harness in /app/harness.py that gets the site, task text, start page and first page observation, and uses a single browser tool whose stop action records the final response.",
    "rules": [
     "Model weights, the browser tool and the success criterion stay fixed. Do not access unseen cases or their answers, use unmetered inference or contact the internet.",
     "Browser actions and answers must come from the worker's replies in that episode. A harness that supplies actions or answers itself does not complete the case.",
     "Per-task caps: 48 worker calls, 327680 total tokens, 32768 context tokens, 4096 output tokens per call, 30 browser actions and 600 wall seconds.",
     "Research budget: four hours, at most 24 development episodes and 7,864,320 reserved worker tokens."
    ],
    "scoring": "On unseen cases written from task templates that no development case uses, a task counts as completed only if the recorded response has the right task type, status and values, and any required final page or site change is in place."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "A100-80",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 0.5,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.375,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.1666666666666661,
       "raw": 0.4583333333333333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.08333333333333305
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.375,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.375,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.20833333333333334,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.3333333333333333,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.2916666666666667,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.4166666666666667,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.375,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.20833333333333334,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.16666666666666666,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.16666666666666666,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.041666666666666664,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "bulk-inference",
   "category": "inference",
   "title": "Bulk inference",
   "desc": "Minimize the wall-clock time to generate responses for a large prompt collection with a frozen model, with exact outputs.",
   "metric": "throughput (output tokens/s)",
   "digits": 0,
   "percent": false,
   "suffix": "",
   "direction": "maximize",
   "best_raw": 4454.419949047416,
   "best_model": "Claude Fable 5.2",
   "nop": {
    "reward": 0.0,
    "raw": 60.67427409093954,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the total wall-clock time, reported as output tokens per second, to generate responses for a collection of prompts with the frozen Qwen2.5-1.5B-Instruct model on one H100.",
    "handin": "Edit `/app/submission/candidate.py` and implement `generate_all(requests, model_path, device)`, which returns a list of lists of generated token IDs in the original request order.",
    "rules": [
     "Outputs must be exactly the same token IDs as the supplied sequential greedy program, with exactly `max_new_tokens` tokens per request, including after EOS.",
     "Model weights, tokenizer, prompt text, output lengths and the greedy decoding rule are fixed.",
     "Do not change files outside `/app/submission`, and do not download or modify model assets.",
     "A 500-request run must finish within one hour; incorrect, incomplete or timed-out runs fail."
    ],
    "scoring": "Total wall-clock time is measured on a 500-request production workload with input lengths of about 64 to 512 tokens and output lengths of 16, 32 or 64 tokens, and it includes process startup, model loading, tokenization, inference and writing outputs."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 4454.419949047416,
       "status": "success"
      },
      {
       "reward": 0.9156571878904916,
       "raw": 4416.85011856548,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.9578285939452458
    },
    {
     "trials": [
      {
       "reward": 0.3605709092567408,
       "raw": 4169.591379266613,
       "status": "success"
      },
      {
       "reward": 0.3266442096629175,
       "raw": 4154.479002519007,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.3436075594598291
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 813.364930939396,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1462.9943186581893,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3176.415060374153,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 2794.186967616429,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3234.9998122934408,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1634.6612334580207,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 385.89178001860904,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 434.20737054428525,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3051.942973559423,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 2735.0872340622677,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3486.8953900849406,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3225.247559032618,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 266.5617213703529,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 230.04586615640608,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "cache-aware-replica-routing",
   "category": "inference",
   "title": "Cache-aware replica routing",
   "desc": "Route requests across two model replicas with local prefix caches to minimize mean response latency.",
   "metric": "speedup over the starter",
   "digits": 3,
   "percent": false,
   "suffix": "\u00d7",
   "direction": "maximize",
   "best_raw": 1.716622137413676,
   "best_model": "Muse Wonder 1.0",
   "nop": {
    "reward": 0.0,
    "raw": 0.998585463731741,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize mean request response latency, reported as speedup over the starter policy, by routing requests between two frozen Qwen2.5-1.5B-Instruct FP32 replicas, each on its own H100 with an exact prompt-prefix cache.",
    "handin": "Edit `/app/submission/candidate.py` to define `plan(now, pending, replicas, bytes_per_token, cache_budget)`, which returns `(request_id, replica_id)` to dispatch a request or `(-1, -1)` to wait.",
    "rules": [
     "Every request must receive exactly its required number of greedy output tokens, and outputs must match independent target decoding.",
     "Dispatch only to a replica with fewer than four outstanding requests, and do not overtake an older visible request that has already been overtaken eight times.",
     "The full trace must finish within 120 seconds with no request loss, duplication or starvation, and total GPU memory must stay within 16 GiB per GPU.",
     "Model execution, cache admission and response handling are fixed, and the policy uses a restricted pure-Python subset with a 100 ms limit per callback."
    ],
    "scoring": "Mean response latency is measured on the full request trace, from each request's stated arrival until the coordinator receives its complete output, including dispatch, IPC, queueing, GPU computation and prefix-cache operations."
   },
   "hours": 0.75,
   "gpus": 2,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.4996289750402742,
       "raw": 1.6307273395770525,
       "status": "success"
      },
      {
       "reward": 0.8720287047797932,
       "raw": 1.6946543015808253,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.6858288399100337
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.4338042910130506,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 1.716622137413676,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.6605429725003904,
       "raw": 1.6583501926030288,
       "status": "success"
      },
      {
       "reward": 0.08881188530094879,
       "raw": 1.560205568509614,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.3746774289006696
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.5356451442714822,
       "status": "success"
      },
      {
       "reward": 0.29032383580537496,
       "raw": 1.5947975560285446,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.14516191790268748
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.9992253803072341,
       "status": "success"
      },
      {
       "reward": 0.2818754270326222,
       "raw": 1.5933472834760218,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.1409377135163111
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.381573102721799,
       "status": "success"
      },
      {
       "reward": 0.21265224179840642,
       "raw": 1.5814642782564876,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.10632612089920321
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.4187239815306318,
       "status": "success"
      },
      {
       "reward": 0.029741805577393855,
       "raw": 1.5500654678583894,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.014870902788696927
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.5406067883311179,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.4587518226949912,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.4399786422251366,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.46895745223694,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "separated-prefill-and-decode",
   "category": "inference",
   "title": "Disaggregated prefill and decode",
   "desc": "Split prompt processing and token generation across two GPUs to minimize the duration of a request stream.",
   "metric": "stream duration (s)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 3.832830198025002,
   "best_model": "GPT-6.1 Sol",
   "nop": {
    "reward": 0.0,
    "raw": 11.354122346399999,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize average stream duration by scheduling prompt processing and token generation across two H100 GPUs that each hold the frozen Qwen2.5-1.5B-Instruct model in FP32.",
    "handin": "Edit only `/app/submission/candidate.py` and keep `plan(now, ready, busy, free_bytes, bytes_per_token)`, which returns a list of up to two actions `(gpu, request_ids, quantum)`.",
    "rules": [
     "Every token must exactly match independently executed uncached output from the frozen model.",
     "Every request must finish within 120 seconds, with p95 time to first token at most 20 seconds and p95 gap between output tokens at most two seconds.",
     "Request-state reservations across both GPUs are limited to 2 GiB, and total GPU memory is limited to 16 GiB per device.",
     "Batches must contain only unstarted requests that share a prompt length or only started requests that share a KV-cache length, and both GPUs cannot be left idle while requests are ready."
    ],
    "scoring": "Stream duration is measured from stream start until the last request finishes, on streams of 24 requests with prompt lengths of 512, 2,048 or 4,096 tokens and output lengths of 16 or 32 tokens."
   },
   "hours": 4.0,
   "gpus": 2,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.925044041372354,
       "raw": 3.864751693774997,
       "status": "success"
      },
      {
       "reward": 0.8981037218918104,
       "raw": 3.876224768224938,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.9115738816320822
    },
    {
     "trials": [
      {
       "reward": 0.5755976298237353,
       "raw": 4.013570444749999,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 3.832830198025002,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.7877988149118677
    },
    {
     "trials": [
      {
       "reward": 0.80361340355281,
       "raw": 3.9164653621750176,
       "status": "success"
      },
      {
       "reward": 0.702689304345621,
       "raw": 3.9594459105249937,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.7531513539492155
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 4.26144564335,
       "status": "success"
      },
      {
       "reward": 0.8713643859753983,
       "raw": 3.8876122498,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.43568219298769917
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.484042010550138,
       "status": "success"
      },
      {
       "reward": 0.8174237100340046,
       "raw": 3.910583966650006,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.4087118550170023
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.42826681795002,
       "status": "success"
      },
      {
       "reward": 0.7498542103314767,
       "raw": 3.9393597909750384,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.37492710516573835
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.455207597974997,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 5.0768818474750015,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 6.022464691625055,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.314221027149972,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 4.357960555900002,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 6.490966077874953,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "adaptive-prefill-chunking",
   "category": "inference",
   "title": "Schedule prefill and decode",
   "desc": "Schedule prompt and generation work on one GPU to maximize output tokens per second within streaming latency limits.",
   "metric": "speedup over the starter",
   "digits": 3,
   "percent": false,
   "suffix": "\u00d7",
   "direction": "maximize",
   "best_raw": 1.6713197051824389,
   "best_model": "Muse Wonder 1.0",
   "nop": {
    "reward": 0.0,
    "raw": 1.0056236886503656,
    "status": "success"
   },
   "summary": {
    "goal": "Maximize completed output tokens per second, reported as speedup over the starter policy, for a streaming service running the pinned Qwen2.5-1.5B-Instruct FP32 model on one H100.",
    "handin": "Edit only `/app/submission/candidate.py` and implement `plan(now, ready, free_bytes, bytes_per_token)`, which returns `(request_ids, quantum)` for the next prompt or decode action.",
    "rules": [
     "Outputs must match frozen-model greedy generation in original request order; FP32 near-ties within 0.0001 logit of the maximum are accepted.",
     "All requests must finish within 120 seconds, with p95 first-token latency at most 30 seconds and p95 inter-token latency at most three seconds.",
     "Request reservations must fit a 512 MiB budget, and total allocated GPU memory must stay within 16 GiB.",
     "Each action selects 1\u20138 requests with equal cached-token lengths, prompt and decode work cannot share a batch, and the policy uses a restricted pure-Python subset with a 100 ms limit per callback."
    ],
    "scoring": "Output tokens per second is measured on full workloads of 11\u201313 requests with staggered arrivals, after a separate-input warm-up, over two independent seeds and eight repetitions per seed."
   },
   "hours": 0.75,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.656249689637617,
       "raw": 1.613868038445316,
       "status": "success"
      },
      {
       "reward": 0.6183984578468908,
       "raw": 1.607541887489589,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.6373240737422539
    },
    {
     "trials": [
      {
       "reward": 0.4810497988243628,
       "raw": 1.5845865354591155,
       "status": "success"
      },
      {
       "reward": 0.7086593929642454,
       "raw": 1.6226273754365719,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5948545958943041
    },
    {
     "trials": [
      {
       "reward": 0.6153533378452185,
       "raw": 1.607032950583245,
       "status": "success"
      },
      {
       "reward": 0.5014806252933343,
       "raw": 1.588001179746191,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.5584169815692763
    },
    {
     "trials": [
      {
       "reward": 0.3557241499196737,
       "raw": 1.5636406128011973,
       "status": "success"
      },
      {
       "reward": 0.70976251224104,
       "raw": 1.6228117419350192,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.5327433310803569
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.460881512062471,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 1.6713197051824389,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.12347383370147096,
       "raw": 1.5248241597981638,
       "status": "success"
      },
      {
       "reward": 0.7018877758933869,
       "raw": 1.6214956217319243,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.4126808047974289
    },
    {
     "trials": [
      {
       "reward": 0.3305808331204413,
       "raw": 1.559438360719177,
       "status": "success"
      },
      {
       "reward": 0.07685363433787298,
       "raw": 1.5170324340125723,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.20371723372915712
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.4547321893109473,
       "status": "success"
      },
      {
       "reward": 0.379159120516053,
       "raw": 1.5675573456160072,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.1895795602580265
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.4777265272155662,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "branch-sharing-generation",
   "category": "inference",
   "title": "Shared-prompt branch generation",
   "desc": "Generate many continuations that share a long prompt as fast as possible, with exact greedy outputs.",
   "metric": "workload time (s)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 1.0614567414500022,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": 28.354186770212504,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the average completion time of a three-request workload in which many branches share each prompt, using Qwen2.5-1.5B-Instruct in FP32 on one H100.",
    "handin": "Edit only `/app/submission/candidate.py` and keep `generate(forward, prompt, branches, steps)`, which returns one int64 tensor shaped `[1, steps]` per branch with only the newly generated tokens, in the original order.",
    "rules": [
     "Each branch must produce exactly 16 new tokens that match independent greedy decoding, including after an end-of-sequence token.",
     "Total GPU memory must stay within 8 GiB, including model weights and temporary state.",
     "The model, tokenizer, weights and forward implementation are fixed, and the source may use only the tensor-only API in `/opt/runtime/numeric_policy.py`.",
     "Source must fit within 64 KiB, and each `generate` call has a 180-second wall-clock limit."
    ],
    "scoring": "Completion time is measured on workloads of three requests with prompt lengths of 1,024, 2,048 and 4,096 tokens and 8, 16 and 32 branches, and the time includes submission code, model calls, cache copies and output transfers."
   },
   "hours": 4.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.8045026965434168,
       "raw": 1.0845136226377008,
       "status": "success"
      },
      {
       "reward": 0.9611635137683797,
       "raw": 1.0660371025749782,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.8828331051558982
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.2155224041250074,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 1.0614567414500022,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 2.4856160538750487,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 2.9482119762750587,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.931732652050016,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 2.078621003862497,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 2.3808582614124703,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 2.4122341978249837,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 4.610495896399997,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.041157304087503,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 2.5606118888874674,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.2660969215375304,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 4.684705519600027,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.9424152948500364,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.5919493157500026,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-parameter-update",
   "category": "kernels",
   "title": "AdamW parameter update",
   "desc": "A fast AdamW optimizer kernel that updates 8 to 15 parameter tensors of up to 8 million elements each.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 2.9314239025115967,
   "best_model": "Kimi K3.1 Pro",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of AdamW updates on an NVIDIA H100, for collections of 8 to 15 parameter tensors with 1,024 to 8,000,000 elements each and BF16 or FP32 parameters.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, and returns the updated parameters and moments as (p0, m0, v0, p1, m1, v1, ...).",
    "rules": [
     "Updates are computed in FP32 with FP32 moment states. Over 100 consecutive updates, state NRMSE must be at most 0.0001 for FP32 and 0.02 for BF16.",
     "For a single BF16 update, the output error divided by the norm of the reference change must be at most 0.5, and must be exact where the change is zero. Values at a BF16 rounding boundary may round either way.",
     "Peak GPU allocation must stay within 16 GiB for the timed sweep. The untimed 100-update checks do not count toward it.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering the GPU operations in the sweep, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.7857258755247847,
       "raw": 3.001215934753418,
       "status": "success"
      },
      {
       "reward": 0.8386800856881457,
       "raw": 2.9839680194854736,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.8122029806064652
    },
    {
     "trials": [
      {
       "reward": 0.8358311882695177,
       "raw": 2.984895944595337,
       "status": "success"
      },
      {
       "reward": 0.7115498683519527,
       "raw": 3.025376081466675,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.7736905283107351
    },
    {
     "trials": [
      {
       "reward": 0.7104694540174473,
       "raw": 3.0257279872894287,
       "status": "success"
      },
      {
       "reward": 0.3397877869098257,
       "raw": 3.1464641094207764,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5251286204636365
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.271552085876465,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 2.9314239025115967,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.2807427043362892,
       "raw": 3.165695905685425,
       "status": "success"
      },
      {
       "reward": 0.7085047981408806,
       "raw": 3.0263679027557373,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.49462375123858493
    },
    {
     "trials": [
      {
       "reward": 0.30314227008845607,
       "raw": 3.158400058746338,
       "status": "success"
      },
      {
       "reward": 0.6195924079177357,
       "raw": 3.055327892303467,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.4613673390030959
    },
    {
     "trials": [
      {
       "reward": 0.29557717378282405,
       "raw": 3.1608641147613525,
       "status": "success"
      },
      {
       "reward": 0.2762234102297607,
       "raw": 3.167167901992798,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.2859002920062924
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.3360960483551025,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.4547200202941895,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.4712319374084473,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-masked-attention",
   "category": "kernels",
   "title": "Block-masked attention, forward and backward",
   "desc": "A fast block-sparse attention kernel for both passes, with 10% to 40% mask density.",
   "metric": "100-case sweep time (ms)",
   "digits": 2,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 51.023841857910156,
   "best_model": "Gemini 4 Carbon",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of block-masked attention, forward and backward passes, on an NVIDIA H100, for sequence lengths 256 to 8,192, mask block widths of 64 or 128, and target mask densities from 10% to 40%.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, and returns the attention output with the same shape and dtype as Q.",
    "rules": [
     "External tensors are BF16, and outputs and gradients must have NRMSE at most 0.01.",
     "The output must support backpropagation through Q, K and V. Gradients are not returned separately.",
     "Peak GPU allocation must stay within 32 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering GPU input copies, forward computation, the scalar loss and backward computation, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.9457689131413528,
       "raw": 51.331295013427734,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 51.023841857910156,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.9728844565706765
    },
    {
     "trials": [
      {
       "reward": 0.5490564381664094,
       "raw": 53.58038330078125,
       "status": "success"
      },
      {
       "reward": 0.7072636923638679,
       "raw": 52.68345642089844,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.6281600652651387
    },
    {
     "trials": [
      {
       "reward": 0.38152997167826674,
       "raw": 54.53014373779297,
       "status": "success"
      },
      {
       "reward": 0.6998527317740055,
       "raw": 52.72547149658203,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5406913517261361
    },
    {
     "trials": [
      {
       "reward": 0.7252527999877985,
       "raw": 52.58147048950195,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.36262639999389923
    },
    {
     "trials": [
      {
       "reward": 0.0831543630884723,
       "raw": 56.22172927856445,
       "status": "success"
      },
      {
       "reward": 0.573891970704254,
       "raw": 53.43958282470703,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.3285231668963632
    },
    {
     "trials": [
      {
       "reward": 0.40022962718515487,
       "raw": 54.424129486083984,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 57.38240051269531,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.20011481359257743
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 62.49760055541992,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 79.86067199707031,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 94.5165786743164,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 198.14976501464844,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 61.08863830566406,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-causal-attention",
   "category": "kernels",
   "title": "Causal attention, forward and backward",
   "desc": "A fast causal attention kernel for both the forward and backward passes, across 256 to 8,192 tokens.",
   "metric": "100-case sweep time (ms)",
   "digits": 2,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 96.30374145507812,
   "best_model": "Gemini 4 Carbon",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of causal attention, forward and backward passes, on an NVIDIA H100, for batch sizes 1 to 4, 8 or 16 heads, sequence lengths 256 to 8,192, and head dimension 64 or 128.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, and returns the attention output with the same shape and dtype as Q.",
    "rules": [
     "External tensors are BF16, and the output and each input gradient must have NRMSE at most 0.01.",
     "The output must support backpropagation through Q, K and V. Gradients are not returned separately.",
     "Peak GPU allocation must stay within 32 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering GPU input copies, the forward pass, the scalar-loss calculation and the backward pass, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 96.30374145507812,
       "status": "success"
      },
      {
       "reward": 0.7975494037578575,
       "raw": 98.47004699707031,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.8987747018789287
    },
    {
     "trials": [
      {
       "reward": 0.49929729906159687,
       "raw": 101.66146850585938,
       "status": "success"
      },
      {
       "reward": 0.44129547631715593,
       "raw": 102.28211212158203,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.4702963876893764
    },
    {
     "trials": [
      {
       "reward": 0.2536389134389688,
       "raw": 104.29011535644531,
       "status": "success"
      },
      {
       "reward": 0.333615390782528,
       "raw": 103.43433380126953,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.2936271521107484
    },
    {
     "trials": [
      {
       "reward": 0.1305159646998535,
       "raw": 105.60758209228516,
       "status": "success"
      },
      {
       "reward": 0.03412765738995741,
       "raw": 106.63897705078125,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.08232181104490545
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 126.80006408691406,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 119.99638366699219,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 115.86022186279297,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 118.70588684082031,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 117.80255889892578,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 113.74752044677734,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 144.51254272460938,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 129.9213409423828,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 111.97401428222656,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 123.9200668334961,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-independent-matrix-workload",
   "category": "kernels",
   "title": "Grouped matrix products",
   "desc": "One fast kernel for a group of 2 to 64 independent matrix products of different sizes.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 6.593599796295166,
   "best_model": "Gemini 4 Carbon",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of grouped matrix products on an NVIDIA H100, where each case is a group of 2 to 64 independent products with M, N and K from 16 to 2,048.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, and returns a tuple of the products of the pairs a0, b0 through a{count-1}, b{count-1} in the same order.",
    "rules": [
     "External tensors are BF16, and every output must have NRMSE at most 0.01.",
     "Products in a collection may have different shapes.",
     "Peak GPU allocation must stay within 8 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering the GPU operations in the sweep, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.2104633418767619,
       "raw": 7.172031879425049,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 6.593599796295166,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.6052316709383809
    },
    {
     "trials": [
      {
       "reward": 0.8817178981934989,
       "raw": 6.680255889892578,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 18.375839233398438,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.44085894909674944
    },
    {
     "trials": [
      {
       "reward": 0.10703199595075968,
       "raw": 7.24780797958374,
       "status": "success"
      },
      {
       "reward": 0.2107249890636822,
       "raw": 7.171840190887451,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.15887849250722094
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 57.12704086303711,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 7.658688068389893,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 8.180895805358887,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 7.927840232849121,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 8.067647933959961,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 8.646112442016602,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 7.851808071136475,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 8.411392211914062,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 10.37161636352539,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 9.64412784576416,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 9.254143714904785,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 7.515071868896484,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-projected-state-attention",
   "category": "kernels",
   "title": "Latent-projected attention",
   "desc": "Attention over a projected latent state, for batches of 1 to 32 and contexts up to 32,768 tokens.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 2.3540799617767334,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of attention over a projected latent state on an NVIDIA H100, for batch sizes 1 to 32, context lengths from 1,024 to 32,768, and latent dimensions of 256 or 512.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, reads q, state, key_projection and value_projection, and returns a BF16 tensor with shape [batch, 1, output_width].",
    "rules": [
     "External outputs are BF16 and must have NRMSE at most 0.01.",
     "The supplied weight and state formats must be kept.",
     "Peak GPU allocation must stay within 32 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering the GPU operations in the sweep, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.444767951965332,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 2.3540799617767334,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.0528640747070312,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.257760047912598,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.6297600269317627,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.5953919887542725,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.739327907562256,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.361120223999023,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 4.97814416885376,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.256608009338379,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.3140480518341064,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.5840001106262207,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.228991985321045,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.2929599285125732,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.662015914916992,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 6.608543872833252,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.4987521171569824,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.332159996032715,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-fragmented-state-attention",
   "category": "kernels",
   "title": "Paged attention",
   "desc": "Attention that reads keys and values through a page table, for contexts of 512 to 32,768 tokens.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 0.5534399747848511,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of attention that reads keys and values through a page table on an NVIDIA H100, for storage blocks of 16 or 32 tokens and context lengths from 512 to 32,768.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, reads q, pages and table, and returns the attention output with the same shape and dtype as Q.",
    "rules": [
     "External tensors are BF16, and output NRMSE must be at most 0.01.",
     "Page tables can repeat or omit pages. Their exact semantics must be kept, and repeated indices contribute repeatedly.",
     "Peak GPU allocation must stay within 32 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering the GPU operations in the sweep, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 1.0,
       "raw": 0.5534399747848511,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.634880006313324,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.981440007686615,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.9535359740257263,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.0342400074005127,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.0592319965362549,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.9583680033683777,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.0736639499664307,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.0288000106811523,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.6250560283660889,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.0330239534378052,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.8956159949302673,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.8881279826164246,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 0.9798399806022644,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 1.5456639528274536,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.1962239742279053,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 0.9971519708633423,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 1.1229439973831177,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  },
  {
   "id": "kernel-rectangular-matrix-workload",
   "category": "kernels",
   "title": "Rectangular matrix products",
   "desc": "A matrix-product plan that stays fast on highly rectangular shapes from 64 to 8,192.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 3.3855679035186768,
   "best_model": "GPT-6.1 Sol",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of rectangular matrix multiplication on an NVIDIA H100, for M, N and K from 64 to 8,192, including highly rectangular shapes and noncontiguous transposed views.",
    "handin": "The agent implements build(specs, output_dir) in /app/submission/candidate.py, which returns a matrix execution plan following /opt/runtime/plan_api.md, with helper and extension sources kept under /app/submission.",
    "rules": [
     "External tensors are BF16, and every output must have NRMSE at most 0.01.",
     "Peak GPU allocation must stay within 8 GiB for the entire sweep.",
     "Custom CUDA extensions can be compiled and tuned during build. The plan cannot contain host callbacks, raw pointers or precomputed output tensors.",
     "The plan must compute each result from its current input buffers, and measurement code must not be modified, interfered with or falsified."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep of the frozen plan after warmup, covering the GPU operations in the sweep, with compilation, tuning, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.9337325840147194,
       "raw": 3.4104959964752197,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 3.3855679035186768,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.9668662920073596
    },
    {
     "trials": [
      {
       "reward": 0.9892812029998942,
       "raw": 3.3896000385284424,
       "status": "success"
      },
      {
       "reward": 0.8754618012928218,
       "raw": 3.4324159622192383,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.932371502146358
    },
    {
     "trials": [
      {
       "reward": 0.8504521200236533,
       "raw": 3.441823959350586,
       "status": "success"
      },
      {
       "reward": 0.9698007781775637,
       "raw": 3.396928071975708,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.9101264491006085
    },
    {
     "trials": [
      {
       "reward": 0.7853756110607946,
       "raw": 3.466304063796997,
       "status": "success"
      },
      {
       "reward": 0.9301598629474537,
       "raw": 3.4118399620056152,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.8577677370041241
    },
    {
     "trials": [
      {
       "reward": 0.8035801998873107,
       "raw": 3.459455966949463,
       "status": "success"
      },
      {
       "reward": 0.878779101641601,
       "raw": 3.4311680793762207,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.8411796507644558
    },
    {
     "trials": [
      {
       "reward": 0.9262467921883091,
       "raw": 3.4133119583129883,
       "status": "success"
      },
      {
       "reward": 0.712048315712684,
       "raw": 3.4938879013061523,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.8191475539504965
    },
    {
     "trials": [
      {
       "reward": 0.5734740196566207,
       "raw": 3.546015977859497,
       "status": "success"
      },
      {
       "reward": 0.6872934213636931,
       "raw": 3.503200054168701,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.6303837205101569
    },
    {
     "trials": [
      {
       "reward": 0.5913382587912579,
       "raw": 3.5392959117889404,
       "status": "success"
      },
      {
       "reward": 0.6227277538378072,
       "raw": 3.5274879932403564,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.6070330063145326
    },
    {
     "trials": [
      {
       "reward": 0.4996358828715373,
       "raw": 3.573791980743408,
       "status": "success"
      },
      {
       "reward": 0.5239648647569478,
       "raw": 3.5646400451660156,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5118003738142426
    }
   ]
  },
  {
   "id": "kernel-single-query-attention",
   "category": "kernels",
   "title": "Single-query decode attention",
   "desc": "Attention for one query over a long context of up to 65,536 tokens.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 9.216575622558594,
   "best_model": "Claude Opus 5.5",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of single-query attention over a long context on an NVIDIA H100, for batches of 1 to 32, context lengths from 1,024 to 65,536, and head dimensions of 64 or 128.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, reads q, k and v, and returns the attention output with the same shape and dtype as Q.",
    "rules": [
     "External tensors are BF16, and output NRMSE must be at most 0.01.",
     "Peak GPU allocation must stay within 32 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering the GPU operations in the sweep, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.6082431386507838,
       "raw": 9.617759704589844,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 9.216575622558594,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.8041215693253919
    },
    {
     "trials": [
      {
       "reward": 0.5776818345494953,
       "raw": 9.649056434631348,
       "status": "success"
      },
      {
       "reward": 0.7850446179125603,
       "raw": 9.4367036819458,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.6813632262310279
    },
    {
     "trials": [
      {
       "reward": 0.60089918752354,
       "raw": 9.625280380249023,
       "status": "success"
      },
      {
       "reward": 0.4529398982645366,
       "raw": 9.776800155639648,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.5269195428940383
    },
    {
     "trials": [
      {
       "reward": 0.3655705339663167,
       "raw": 9.86627197265625,
       "status": "success"
      },
      {
       "reward": 0.647958771889887,
       "raw": 9.577088356018066,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5067646529281019
    },
    {
     "trials": [
      {
       "reward": 0.5613390754406947,
       "raw": 9.665792465209961,
       "status": "success"
      },
      {
       "reward": 0.4027866535323889,
       "raw": 9.828160285949707,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.4820628644865418
    },
    {
     "trials": [
      {
       "reward": 0.10399326178463303,
       "raw": 10.134143829345703,
       "status": "success"
      },
      {
       "reward": 0.7192358872052546,
       "raw": 9.504096031188965,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.41161457449494376
    },
    {
     "trials": [
      {
       "reward": 0.33013499194973606,
       "raw": 9.902560234069824,
       "status": "success"
      },
      {
       "reward": 0.4505335110323786,
       "raw": 9.779264450073242,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.3903342514910573
    },
    {
     "trials": [
      {
       "reward": 0.6788637125579968,
       "raw": 9.545439720153809,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 10.396256446838379,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.3394318562789984
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 10.550848007202148,
       "status": "success"
      },
      {
       "reward": 0.34438426866771193,
       "raw": 9.887968063354492,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.17219213433385597
    }
   ]
  },
  {
   "id": "kernel-logit-selection",
   "category": "kernels",
   "title": "Top-k and top-p sampling",
   "desc": "A fast sampling kernel with top-k, top-p and temperature over vocabularies of up to 131,072 tokens.",
   "metric": "100-case sweep time (ms)",
   "digits": 3,
   "percent": false,
   "suffix": "",
   "direction": "minimize",
   "best_raw": 1.9459840059280396,
   "best_model": "Gemini 4 Carbon",
   "nop": {
    "reward": 0.0,
    "raw": null,
    "status": "success"
   },
   "summary": {
    "goal": "Minimize the latency of a 100-case sweep of top-k and top-p sampling from logits on an NVIDIA H100, for batches of 1 to 256, vocabularies of 8,192 to 131,072 plus small 16-token vocabularies, k from 1 to 100, and p from 0.8 to 1.0.",
    "handin": "The agent implements run(inputs) in /app/submission/candidate.py, keeps all helpers in that file, reads logits, uniforms, k, p and temperature, and returns (probabilities, samples) as FP32 probabilities and int64 token indices.",
    "rules": [
     "Probabilities must be nonnegative, sum to one within 1e-5, and have NRMSE at most 1e-4 against the softmax renormalized over the retained top-p prefix.",
     "Samples must agree with the supplied uniforms and the returned probability CDF within a boundary tolerance of 1e-10. The 16-token cases require total-variation error at most 0.01 over one million samples.",
     "Peak GPU allocation must stay within 8 GiB for the entire sweep.",
     "Code uses the restricted Python subset in /opt/runtime/restricted.py, with no file, process, reflection or timer access."
    ],
    "scoring": "Latency is a timed CUDA Graph replay of a 100-input sweep after warmup, covering the GPU operations in the sweep, with compilation, warmup and CPU-GPU transfers excluded."
   },
   "hours": 2.0,
   "gpus": 1,
   "gpu_type": "H100",
   "models": [
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.8869121074676514,
       "status": "success"
      },
      {
       "reward": 1.0,
       "raw": 1.9459840059280396,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Carbon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.5
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 4.628448009490967,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.40012788772583,
       "status": "success"
      }
     ],
     "model": "Claude Opus 5.5",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 5.9911041259765625,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 4.356095790863037,
       "status": "success"
      }
     ],
     "model": "GPT-6.1 Sol",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      }
     ],
     "model": "Gemini 4 Argon",
     "harness": "Antigravity CLI",
     "effort": "high",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 3.4039039611816406,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.922463893890381,
       "status": "success"
      }
     ],
     "model": "GPT-6 Astra",
     "harness": "Codex",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 7.384736061096191,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 23.325408935546875,
       "status": "success"
      }
     ],
     "model": "Muse Wonder 1.0",
     "harness": "Muse Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 2.6430718898773193,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 3.4586238861083984,
       "status": "success"
      }
     ],
     "model": "Claude Fable 5.2",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 8.399328231811523,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": null,
       "status": "success"
      }
     ],
     "model": "Grok 4.7",
     "harness": "Grok Build",
     "effort": "xhigh",
     "avg": 0.0
    },
    {
     "trials": [
      {
       "reward": 0.0,
       "raw": 11.217727661132812,
       "status": "success"
      },
      {
       "reward": 0.0,
       "raw": 13.009759902954102,
       "status": "success"
      }
     ],
     "model": "Kimi K3.1 Pro",
     "harness": "Claude Code",
     "effort": "max",
     "avg": 0.0
    }
   ]
  }
 ],
 "models": {
  "Claude Fable 5.2": {
   "color": "#D62F26",
   "lab": "Anthropic",
   "cost": {
    "total_usd": 2011.89,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 0
   }
  },
  "Claude Opus 5.5": {
   "color": "#F08A12",
   "lab": "Anthropic",
   "cost": {
    "total_usd": 1114.32,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 0
   }
  },
  "GPT-6.1 Sol": {
   "color": "#5FB3E6",
   "lab": "OpenAI",
   "cost": {
    "total_usd": 531.41,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 0
   }
  },
  "GPT-6 Astra": {
   "color": "#1D4FC4",
   "lab": "OpenAI",
   "cost": {
    "total_usd": 2829.2,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 0
   }
  },
  "Gemini 4 Carbon": {
   "color": "#146B34",
   "lab": "Google",
   "cost": {
    "total_usd": 386.08,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 1,
    "estimated": 0,
    "rebuilt": 15
   }
  },
  "Gemini 4 Argon": {
   "color": "#7FCF5A",
   "lab": "Google",
   "cost": {
    "total_usd": 397.97,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 0
   }
  },
  "Kimi K3.1 Pro": {
   "color": "#7B3FC4",
   "lab": "Moonshot",
   "cost": {
    "total_usd": 264.51,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 54,
    "rebuilt": 0
   }
  },
  "Muse Wonder 1.0": {
   "color": "#959595",
   "lab": "Meta",
   "cost": {
    "total_usd": 262.21,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 0
   }
  },
  "Grok 4.7": {
   "color": "#111111",
   "lab": "xAI",
   "cost": {
    "total_usd": 1644.82,
    "tasks_with_cost": 27,
    "tasks_imputed": 0,
    "trials_without_cost": 0,
    "estimated": 0,
    "rebuilt": 18
   }
  }
 },
 "stats": {
  "tasks": 27,
  "agent_trials": 486,
  "agent_hours": 1321,
  "models": 9
 }
};
