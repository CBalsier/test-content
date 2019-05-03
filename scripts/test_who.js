const CSVToObjectKeyMap = Object.freeze({
    'PUBLICATION SUR LE SITE': 'published',
    'MEMBRE DU COLLECTIF': 'name',
    'PRESENTATION SUCCINCTE': 'presentation',
    'ECHELLE DE SON ACTION': 'scale',
    'SITE WEB': 'url',
    'TWEET': 'twitter',
    'ACTIVITES': 'activities',
    'CONTACT SUR LE SITE DU CIS': 'contact',
    'FONCTION DU CONTACT': 'contactRole',
    'NOM Photo portrait': 'portraitURL',
    'NOM Photo logo': 'logoFilename',
    'Sous dossier attaché': 'logoFolder',
    'Code scraper OID': 'spiderId'
})

const membersP = fetch('https://raw.githubusercontent.com/CBalsier/test-content/master/data/members.csv')
.then(r => r.text())
.then(d3.csvParse)
.then(dataFromText => {
    console.log('dataFromText', dataFromText);

    const rowsByMemberName = new Map();

    for(const row of dataFromText){
        const name = row['MEMBRE DU COLLECTIF']

        if(!rowsByMemberName.has(name)){
            rowsByMemberName.set(name, new Set())
        }

        const rows = rowsByMemberName.get(name)
        rows.add(row);
    }


    const membersByName = new Map()

    for(const [name, rows] of rowsByMemberName){
         if(!membersByName.has(name)){
            membersByName.set(name, {
                name: name,
                activities: new Set()
            })
        }

        const member = membersByName.get(name)

        for(const row of rows){
            for(let [csvKey, value] of Object.entries(row)){
                const objectKey = CSVToObjectKeyMap[csvKey.trim()]
                value = value.trim();
                if(value){
                    if(objectKey === 'activities'){
                        member.activities.add(value);
                    }
                    else{
                        member[objectKey] = value;
                    }
                }
            }
        }
    }

    return [...membersByName.values()]
        .filter(member => member.published === 'ok')

})
.catch(err => console.error('members data error', err));


// TODO: this will not work with new data outside OpenScraper! (eg Solidata/CSV files)
const spiderCountByIdP = fetch('http://www.cis-openscraper.com/api/stats?only_spiders_stats=true')
        .then(r => r.json())
        .then(r => r.counts_stats.spiders_stats)


//document.addEventListener('DOMContentLoaded', e => {
    console.log("test load DOM", document.readyState);
    let selectedActivityFilters = new Set();
    let filterText = '';

    function isMemberSelected(member){
        const matchesFilters = [...member.activities].some(a => selectedActivityFilters.has(a))

        const filterTextLow = filterText.toLowerCase()

        const matchesText = filterText === '' || member.name.toLowerCase().includes(filterTextLow) || member.presentation.toLowerCase().includes(filterTextLow)

        return matchesFilters && matchesText
    }

    Promise.all([membersP, spiderCountByIdP])
    .then(([members, spiderCountById]) => {
        console.log('members', members)

        function renderMemberList(){
            const selectedMembers = members.filter(isMemberSelected)

            console.log('selectedMembers', selectedMembers)

            const newUl = Bouture.ul({class: 'members'}, selectedMembers.map(member => {
                console.log('member spiderCountById', member, spiderCountById)

                const count = spiderCountById[member.spiderId]

                return Bouture.li([
                    Bouture.header([
                        Bouture.div([
                            Bouture.img({src: member.logoFolder && member.logoFilename ? `https://raw.githubusercontent.com/CBalsier/test-content/master/logos/Partenaires/${member.logoFolder}/${member.logoFilename}`: ''}),
                            Bouture.ul(
                                {class: 'activities'},
                                [...member.activities].map(a => Bouture.li(a))
                            )
                        ]),
                        Bouture.div([
                            Bouture.h1(member.name),
                            member.scale ? Bouture.span({class: 'scale'}, `Echelle ${member.scale}`) : ''
                        ])
                    ]),
                    Bouture.p(member.presentation),
                    Bouture.footer([
                        member.portraitURL ? Bouture.img({src: `https://raw.githubusercontent.com/CBalsier/test-content/master/photos/membres/${member.portraitURL}`}) : '',
                        Bouture.div({class: 'person'}, [
                            Bouture.div(member.contact),
                            Bouture.div(member.contactRole)
                        ]),
                        count ? Bouture.div({class: 'count', 'data-spider-id': member.spiderId}, [
                            Bouture.span({class: 'nb'}, count),
                            Bouture.span('projets partagés'),
                        ]) : ''
                    ])
                ])
            })).getElement()

            document.querySelector('main section ul.members').replaceWith(newUl)
        }

        // build activities filter
        let activities = new Set();
        for(const m of members){
            for(const a of m.activities){
                activities.add(a)
            }
        }

        // all activities are selected by default
        selectedActivityFilters = new Set(activities);

        const activitiesCheckboxes = Bouture.div({class: 'choices'}, [...activities].map(a => {
            return Bouture.label(
                {class: 'checkbox'}, 
                [
                    Bouture.input(
                        {
                            type: 'checkbox',
                            checked: true,
                            onChange(e){
                                if(e.target.checked)
                                    selectedActivityFilters.add(a)
                                else
                                    selectedActivityFilters.delete(a)
                                
                                renderMemberList();
                            }
                        }),
                    Bouture.span(a)
                ]
            )
        }))

        document.querySelector('.activities').append(activitiesCheckboxes.getElement())

        // make input responsive
        document.querySelector('input[type="search"]').addEventListener('input', e => {
            filterText = e.target.value;

            renderMemberList();
        })


        // build members list
        renderMemberList();
    })
    .catch(err => console.error('page build error', err))


//}, {once: true})
