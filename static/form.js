const form = document.querySelector('form')
const offenseField = document.querySelector('#offense')
const infoField = document.querySelector('#info')
const dataField = document.querySelector('#data')
const scopeField = document.querySelector('#scope')
const locationField = document.querySelector('#location')
// const agencyField = document.querySelector('#ori')

const victimDataChoices = [
    ["age","Age"],
    ["relationship","Relationship"],
    ["count","Count"],
    ["ethnicity","Ethnicity"],
    ["race","Race"],
    ["sex","Sex"]
]

const offenseDataChoices = [
    ["count","Count"],
    ["weapons","Weapons Used"],
    ["linkedoffense","Linked Offense"],
    ["suspectusing","Substance Used"],
    ["criminal_activity","Relation to Criminal Activity"],
    ["property_recovered","Property Recovered"],
    ["property_stolen","Property Stolen"],
    ["bias","Motivation"]
]

const states = [
    [
        "AL",
        "Alabama"
    ],
    [
        "AK",
        "Alaska"
    ],
    [
        "AZ",
        "Arizona"
    ],
    [
        "AR",
        "Arkansas"
    ],
    [
        "CA",
        "California"
    ],
    [
        "CO",
        "Colorado"
    ],
    [
        "CT",
        "Connecticut"
    ],
    [
        "DC",
        "District of Columbia"
    ],
    [
        "DE",
        "Delaware"
    ],
    [
        "FL",
        "Florida"
    ],
    [
        "GA",
        "Georgia"
    ],
    [
        "HI",
        "Hawaii"
    ],
    [
        "ID",
        "Idaho"
    ],
    [
        "IL",
        "Illinois"
    ],
    [
        "IN",
        "Indiana"
    ],
    [
        "IA",
        "Iowa"
    ],
    [
        "KS",
        "Kansas"
    ],
    [
        "KY",
        "Kentucky"
    ],
    [
        "LA",
        "Louisiana"
    ],
    [
        "ME",
        "Maine"
    ],
    [
        "MD",
        "Maryland"
    ],
    [
        "MA",
        "Massachusetts"
    ],
    [
        "MI",
        "Michigan"
    ],
    [
        "MN",
        "Minnesota"
    ],
    [
        "MS",
        "Mississippi"
    ],
    [
        "MO",
        "Missouri"
    ],
    [
        "MT",
        "Montana"
    ],
    [
        "NE",
        "Nebraska"
    ],
    [
        "NV",
        "Nevada"
    ],
    [
        "NH",
        "New Hampshire"
    ],
    [
        "NJ",
        "New Jersey"
    ],
    [
        "NM",
        "New Mexico"
    ],
    [
        "NY",
        "New York"
    ],
    [
        "NC",
        "North Carolina"
    ],
    [
        "ND",
        "North Dakota"
    ],
    [
        "OH",
        "Ohio"
    ],
    [
        "OK",
        "Oklahoma"
    ],
    [
        "OR",
        "Oregon"
    ],
    [
        "PA",
        "Pennsylvania"
    ],
    [
        "PR",
        "Puerto Rico"
    ],
    [
        "RI",
        "Rhode Island"
    ],
    [
        "SC",
        "South Carolina"
    ],
    [
        "SD",
        "South Dakota"
    ],
    [
        "TN",
        "Tennessee"
    ],
    [
        "TX",
        "Texas"
    ],
    [
        "UT",
        "Utah"
    ],
    [
        "VT",
        "Vermont"
    ],
    [
        "VA",
        "Virginia"
    ],
    [
        "WA",
        "Washington"
    ],
    [
        "WV",
        "West Virginia"
    ],
    [
        "WI",
        "Wisconsin"
    ],
    [
        "WY",
        "Wyoming"
    ]
]

const regions = [
    ['midwest', 'Midwest'],
    ['west', 'West'],
    ['northeast', 'Northeast'],
    ['south', 'South']
]

const capitalize = (string) => {
    const lower = string.toLowerCase()
    first = string.charAt(0)
    firstCap = first.toUpperCase()
    return firstCap + lower.slice(1,)

}

const changeFieldOptions = (field, choices) => {
    let optionHTML = ''
    for (const choice of choices) {
        optionHTML += `<option value="${choice[0]}">${choice[1]}</option>`
    }
    field.innerHTML = optionHTML;
    return
}

infoField.onchange = (e) => {
    e.preventDefault()
    let dataOptions
    if (infoField.value == 'offense') {
        dataOptions = offenseDataChoices
    } 
    if (infoField.value == 'victim') {
        dataOptions = victimDataChoices
    }
    changeFieldOptions(dataField, dataOptions)
    return `dataField options changed to ${dataOptions}`
}

async function adjustField(e) {
    // e.preventDefault()
    let dataOptions = []
    if (scopeField.value == 'national') {
        dataOptions = [['','-']]
    } 
    if (scopeField.value == 'regions') {
        dataOptions = regions
    }
    if (scopeField.value == 'states') {
        dataOptions = states
    }
    if (scopeField.value == 'agencies') {
        dataOptions = states
        async function fetch_ori_list() {
            ori_list = await fetch('/agencies').then(response => response.json()).then(data => {return data})
            return await ori_list
        }

        all_oris = await fetch_ori_list()
        dataOptions = all_oris 
    }

    changeFieldOptions(locationField, dataOptions)
    return `locationField options changed to ${dataOptions}`
}

scopeField.onchange = adjustField

adjustField()