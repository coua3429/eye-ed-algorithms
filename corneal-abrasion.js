{
  "id": "corneal-abrasion",
  "title": "Corneal Defects, Abrasions and Foreign Bodies ",
  "disclaimer": [
    "Corneal abrasions are superficial losses of corneal epithelium, which heal quickly[cite: 828].",
    "They usually occur as result of mechanical trauma, so don't forget to look for other signs of blunt or penetrating eye injury[cite: 829].",
    "Fluorescein 2% is useful in diagnosis as it stains the epithelial defect[cite: 830].",
    "Corneal foreign bodies should be removed to allow for epithelial healing to occur[cite: 831].",
    "Don't forget to look for multiple foreign bodies, signs of penetrating eye injury and to evert the lids[cite: 832].",
    "Topical antibiotics are used to prevent subsequent bacterial infection in cases of corneal abrasions and post corneal foreign body removal[cite: 833]."
  ],
  "start": "q1",
  "nodes": {
    "q1": {
      "type": "question",
      "text": "Patient presents with painful, watery eye and blurred vision following trauma[cite: 836]. Examine the eyelids, ocular surface and cornea[cite: 837]. Main finding?",
      "answers": [
        { "label": "Foreign body present on cornea/conjunctiva", "next": "o_fb" },
        { "label": "Cornea is staining with fluorescein showing corneal abrasion", "next": "q2" }
      ]
    },
    "o_fb": {
      "type": "outcome",
      "title": "Remove Foreign Body",
      "severity": "routine",
      "bullets": [
        "Remove FB and treat with topical antibiotics with advice to return on SOS basis[cite: 840]."
      ]
    },
    "q2": {
      "type": "question",
      "text": "Look for anterior signs of penetrating injury (seidels' test, pupil contour, anterior chamber depth, iris transillumination defects, traumatic cataract)[cite: 839]. Look for anterior signs of blunt trauma (traumatic mydriasis, uveitis, hyphema)[cite: 839]. Are these signs present?",
      "answers": [
        { "label": "Yes", "next": "q3" },
        { "label": "No", "next": "o_abrasion" }
      ]
    },
    "o_abrasion": {
      "type": "outcome",
      "title": "Treat as Abrasion",
      "severity": "routine",
      "bullets": [
        "Treat as abrasion and discharge from follow up with advice to return SOS[cite: 842]."
      ]
    },
    "q3": {
      "type": "question",
      "text": "Further investigations and examination are necessary[cite: 841]. CT orbits/x-ray to exclude intraocular FB depending on mode of trauma[cite: 843]. Dilated examination (looking for commotio retinae, retinal tears, dialysis, retinal detachment, choroidal ruptures, or intraocular FB is suspected)[cite: 843]. What is the trauma type?",
      "answers": [
        { "label": "Penetrating trauma present", "next": "o_penetrating" },
        { "label": "Blunt trauma present", "next": "o_blunt" }
      ]
    },
    "o_penetrating": {
      "type": "outcome",
      "title": "Penetrating Trauma",
      "severity": "emergency",
      "bullets": [
        "Plan for primary globe repair under GA[cite: 844]."
      ]
    },
    "o_blunt": {
      "type": "outcome",
      "title": "Blunt Trauma",
      "severity": "urgent",
      "bullets": [
        "Treat medically with drops, watch IOP, involve VR as necessary[cite: 845]."
      ]
    }
  }
}
