const socket = io('https://man-city-or-man-united-backend.onrender.com');

const pB = document.querySelectorAll('.progress-box');
const pT = document.querySelectorAll('.percent-tag');
const totalVotesE = document.getElementById('ZaTotal');

let voteLocked = false;

pB.forEach((element) => {
    element.addEventListener('click', () => {
        if (!voteLocked) {
            pB.forEach(box => box.classList.remove('activated', 'mancity', 'manutd'));
            element.classList.add('activated');
            if (element.id === 'manutd') {
                element.classList.add('manutd');
            } else if (element.id === 'mancity') {
                element.classList.add('mancity');
            }
            voteLocked = true;
        }
    });
});

for (let i = 0; i < pB.length; i++) {
    const ISeeYouLookingAtMyCode = pB[i];
    ISeeYouLookingAtMyCode.addEventListener('click', () => {
        addVote(ISeeYouLookingAtMyCode, ISeeYouLookingAtMyCode.id);
    });
}

let vote = false;

const addVote = (ISeeYouLookingAtMyCode, id) => {
    if (vote) {
        return;
    }
    let voteTo = id;
    socket.emit('send-me-vote', voteTo);
    vote = true;
    ISeeYouLookingAtMyCode.classList.add('activated');
};

socket.on('recieve-vote', data => {
    updateVotes(data);
});

socket.on('update', data => {
    updateVotes(data);
});

const updateVotes = (data) => {
    let votingO = data.votingPolls;
    let totalVotes = data.totalVotes;
    totalVotesE.innerHTML = totalVotes;

    let manCityVotes = votingO.mancity;
    let manUtdVotes = votingO.manutd;

    if (manCityVotes > manUtdVotes) {
        totalVotesE.style.color = '#00fffb';
    } else if (manUtdVotes > manCityVotes) {
        totalVotesE.style.color = '#ff0000';
    } else {
        totalVotesE.style.color = '#fff';
    }

    for (let i = 0; i < pT.length; i++) {
        let vote = votingO[pB[i].id];
        let sW = Math.round(vote / totalVotes * 100);
        const ISeeYouLookingAtMyCode = document.querySelector(`#${pB[i].id}`).querySelector('.percent-tag');
        ISeeYouLookingAtMyCode.setAttribute('data', `${!sW ? 0 : sW}%`);
        ISeeYouLookingAtMyCode.style.width = `${!sW ? 0 : sW}%`;
    }
};
