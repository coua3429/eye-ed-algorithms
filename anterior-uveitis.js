{
  "id": "anterior-uveitis",
  "title": "Photophobia and Anterior Uveitis ",
  "disclaimer": [
    "There are many different causes of photophobia[cite: 784].",
    "Iritis and anterior uveitis are synonyms[cite: 785].",
    "Always dilate patients with anterior uveitis to examine the fundus[cite: 786].",
    "Only some cases of anterior uveitis need further investigation[cite: 787]."
  ],
  "start": "q1",
  "nodes": {
    "q1": {
      "type": "question",
      "text": "Examine the eyelids, ocular surface and cornea[cite: 791]. Is ocular surface disease present? [cite: 790, 792]",
      "answers": [
        { "label": "Yes", "next": "q2_yes" },
        { "label": "No", "next": "q2_no" }
      ]
    },
    "q2_yes": {
      "type": "question",
      "text": "Examine the anterior chamber. Is there inflammation present? [cite: 793]",
      "answers": [
        { "label": "No", "next": "o_treat_surface" },
        { "label": "Yes", "next": "q3" }
      ]
    },
    "q2_no": {
      "type": "question",
      "text": "Examine the anterior chamber. Is there significant inflammation present? [cite: 797]",
      "answers": [
        { "label": "No", "next": "o_discharge_normal" },
        { "label": "Yes", "next": "q3" }
      ]
    },
    "o_treat_surface": {
      "type": "outcome",
      "title": "Treat Ocular Surface Disease",
      "severity": "routine",
      "bullets": [
        "Treat ocular surface disease[cite: 794]."
      ]
    },
    "o_discharge_normal": {
      "type": "outcome",
      "title": "Reassure and Discharge",
      "severity": "routine",
      "bullets": [
        "If all other aspects of examination normal, reassure and discharge the patient[cite: 798]."
      ]
    },
    "q3": {
      "type": "question",
      "text": "Measure and grade inflammation[cite: 795]. Dilate[cite: 795]. Is the posterior segment affected? [cite: 795, 796, 800]",
      "answers": [
        { "label": "Yes", "next": "o_specialist" },
        { "label": "No", "next": "q4" }
      ]
    },
    "o_specialist": {
      "type": "outcome",
      "title": "Escalate to Specialist",
      "severity": "urgent",
      "bullets": [
        "Call uveitis specialist or senior ophthalmologist[cite: 799]."
      ]
    },
    "q4": {
      "type": "question",
      "text": "Are there systemic signs or symptoms? [cite: 801]",
      "answers": [
        { "label": "Yes", "next": "q5" },
        { "label": "No", "next": "q6" }
      ]
    },
    "q5": {
      "type": "question",
      "text": "Consider tailored blood tests and chest x-ray[cite: 803]. Proceed to treatment.",
      "answers": [
        { "label": "Continue to treatment", "next": "q6" }
      ]
    },
    "q6": {
      "type": "question",
      "text": "Treat with tapering dose of topical steroids and mydriatic[cite: 805]. Review in one week[cite: 805]. Improving? [cite: 805]",
      "answers": [
        { "label": "Yes", "next": "o_taper" },
        { "label": "No", "next": "q7" }
      ]
    },
    "o_taper": {
      "type": "outcome",
      "title": "Taper Treatment",
      "severity": "routine",
      "bullets": [
        "Taper treatment and follow up in uveitis clinic four to six weeks[cite: 806].",
        "If in doubt call uveitis specialist or senior ophthalmologist[cite: 806, 807]."
      ]
    },
    "q7": {
      "type": "question",
      "text": "Consider injection of steroid and/or mydriatic and review in a few days[cite: 808]. Improving? [cite: 808]",
      "answers": [
        { "label": "Yes", "next": "o_discharge_sos" },
        { "label": "No", "next": "o_specialist_end" }
      ]
    },
    "o_discharge_sos": {
      "type": "outcome",
      "title": "Discharge SOS",
      "severity": "routine",
      "bullets": [
        "Discharge with follow up SOS[cite: 804]."
      ]
    },
    "o_specialist_end": {
      "type": "outcome",
      "title": "Escalate to Specialist",
      "severity": "urgent",
      "bullets": [
        "Call uveitis specialist or senior ophthalmologist[cite: 809, 810]."
      ]
    }
  }
}
