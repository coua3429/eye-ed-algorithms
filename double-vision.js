{
  "id": "double-vision",
  "title": "Double Vision and New Onset Strabismus",
  "disclaimer": [
    "Organise urgent imaging in pupil involving third nerve palsies or sixth nerve palsies with papilloedema[cite: 350, 351].",
    "Warn patients with sudden onset double vision not to drive[cite: 352].",
    "Always rule out GCA[cite: 353]."
  ],
  "start": "q1",
  "nodes": {
    "q1": {
      "type": "question",
      "text": "Is the double vision present with one eye closed? [cite: 355, 356]",
      "answers": [
        { "label": "Yes (Monocular)", "next": "o_monocular" },
        { "label": "No (Binocular)", "next": "q2" }
      ]
    },
    "o_monocular": {
      "type": "outcome",
      "title": "Monocular Diplopia [cite: 359]",
      "severity": "routine",
      "bullets": [
        "The cause lies within that eye and its refractive media rather than being a fault of ocular motility[cite: 384].",
        "An orthoptist will not be interested in monocular diplopia[cite: 385]."
      ]
    },
    "q2": {
      "type": "question",
      "text": "How is the binocular diplopia separated? [cite: 360, 361]",
      "answers": [
        { "label": "Horizontal", "next": "q3" },
        { "label": "Vertical/diagonal", "next": "q4" },
        { "label": "Variable", "next": "o_myasthenia" }
      ]
    },
    "o_myasthenia": {
      "type": "outcome",
      "title": "Variable Separation [cite: 367]",
      "severity": "urgent",
      "bullets": [
        "Consider Myasthenia gravis[cite: 368]."
      ]
    },
    "q3": {
      "type": "question",
      "text": "Is abduction or adduction affected? [cite: 363]",
      "answers": [
        { "label": "Abduction limited", "next": "o_6th_nerve" },
        { "label": "Adduction limited", "next": "o_ino" }
      ]
    },
    "o_6th_nerve": {
      "type": "outcome",
      "title": "6th Nerve Palsy [cite: 373]",
      "severity": "urgent",
      "bullets": [
        "Organise urgent imaging if associated with papilloedema[cite: 350, 351]."
      ]
    },
    "o_ino": {
      "type": "outcome",
      "title": "Neurological - Internuclear Ophthalmoplegia [cite: 378, 379, 380]",
      "severity": "urgent",
      "bullets": [
        "Adduction limited; consider internuclear ophthalmoplegia[cite: 371, 379, 380]."
      ]
    },
    "q4": {
      "type": "question",
      "text": "Are the lids or pupils abnormal? [cite: 365]",
      "answers": [
        { "label": "Yes", "next": "o_3rd_nerve" },
        { "label": "No", "next": "q5" }
      ]
    },
    "o_3rd_nerve": {
      "type": "outcome",
      "title": "3rd Nerve Palsy [cite: 372]",
      "severity": "emergency",
      "bullets": [
        "Organise urgent imaging in pupil-involving third nerve palsies[cite: 350]."
      ]
    },
    "q5": {
      "type": "question",
      "text": "Is there a restriction of eye movement? [cite: 370]",
      "answers": [
        { "label": "Yes", "next": "o_thyroid" },
        { "label": "No", "next": "o_4th_nerve" }
      ]
    },
    "o_thyroid": {
      "type": "outcome",
      "title": "Thyroid Eye Disease [cite: 376]",
      "severity": "urgent",
      "bullets": [
        "Restriction of eye movement present with normal lids/pupils[cite: 366, 370, 376]."
      ]
    },
    "o_4th_nerve": {
      "type": "outcome",
      "title": "4th Nerve Palsy [cite: 377]",
      "severity": "urgent",
      "bullets": [
        "Vertical/diagonal separation with normal lids/pupils and no generalized restriction of eye movement[cite: 364, 366, 370, 374, 377]."
      ]
    }
  }
}
