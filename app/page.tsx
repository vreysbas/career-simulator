"use client";

import { useState, useEffect, useRef } from "react";

// --- 1. DATA ---
const POSITIONS = ["RB", "ST", "GK", "LW", "CDM", "RM", "CB", "CAM", "LM", "LB", "RW", "CM"];

const NATIONALITIES = [
  "Brazil", "Japan", "England", "Senegal", "Spain", "South Korea", "Germany", "USA", "Italy", "Mexico", 
  "Netherlands", "Morocco", "Portugal", "Switzerland", "Belgium", "Denmark", "Croatia", "Sweden", 
  "Uruguay", "Poland", "Colombia", "Chile", "Nigeria", "Peru", "Algeria", "Australia", "Egypt", 
  "Iran", "Ivory Coast", "Saudi Arabia", "Cameroon", "Turkey", "Ukraine", "Wales", "Scotland", 
  "Norway", "Ecuador", "Ghana", "Canada", "Serbia", "Argentina"
];

const AGES = [
  { label: 15, weight: 10 }, { label: 16, weight: 25 }, { label: 17, weight: 50 },
  { label: 18, weight: 70 }, { label: 19, weight: 50 }, { label: 20, weight: 25 }, { label: 21, weight: 10 }
];

const SEASONS = [
  { label: 6, weight: 5 }, { label: 7, weight: 10 }, { label: 8, weight: 20 },
  { label: 9, weight: 30 }, { label: 10, weight: 45 }, { label: 11, weight: 60 },
  { label: 12, weight: 80 }, { label: 13, weight: 90 }, { label: 14, weight: 100 },
  { label: 15, weight: 90 }, { label: 16, weight: 70 }, { label: 17, weight: 50 },
  { label: 18, weight: 30 }, { label: 19, weight: 15 }, { label: 20, weight: 5 }
];

const HEIGHTS = [
  { label: "5'0\" / 152 cm", weight: 1 }, { label: "5'1\" / 155 cm", weight: 2 },
  { label: "5'2\" / 157 cm", weight: 4 }, { label: "5'3\" / 160 cm", weight: 8 },
  { label: "5'4\" / 163 cm", weight: 12 }, { label: "5'5\" / 165 cm", weight: 18 },
  { label: "5'6\" / 168 cm", weight: 25 }, { label: "5'7\" / 170 cm", weight: 35 },
  { label: "5'8\" / 173 cm", weight: 45 }, { label: "5'9\" / 175 cm", weight: 55 },
  { label: "5'10\" / 178 cm", weight: 65 }, { label: "5'11\" / 180 cm", weight: 70 },
  { label: "6'0\" / 183 cm", weight: 75 }, { label: "6'1\" / 185 cm", weight: 70 },
  { label: "6'2\" / 188 cm", weight: 60 }, { label: "6'3\" / 191 cm", weight: 45 },
  { label: "6'4\" / 193 cm", weight: 30 }, { label: "6'5\" / 196 cm", weight: 20 },
  { label: "6'6\" / 198 cm", weight: 12 }, { label: "6'7\" / 201 cm", weight: 8 },
  { label: "6'8\" / 203 cm", weight: 4 }, { label: "6'9\" / 206 cm", weight: 2 },
  { label: "6'10\" / 208 cm", weight: 1 }, { label: "6'11\" / 211 cm", weight: 0.5 },
  { label: "7'0\" / 213 cm", weight: 0.5 }, { label: "7'1\" / 216 cm", weight: 0.2 }
];

const STAT_PACE = ["1 (Wheelchair)", "2 (Grandpa)", "3 (Maguire)", "4 (Slow)", "5 (Average)", "6 (Quick)", "7 (Fast)", "8 (Rapid)", "9 (Mbappé)", "10 (Flash)"];
const STAT_SHO = ["1 (Blind)", "2 (Stormtrooper)", "3 (Defender)", "4 (Below Avg)", "5 (Average)", "6 (Good)", "7 (Sniper)", "8 (Lethal)", "9 (Ronaldo)", "10 (Puskas)"];
const STAT_PAS = ["1 (To the fans)", "2 (Clumsy)", "3 (Inaccurate)", "4 (Basic)", "5 (Average)", "6 (Good)", "7 (Playmaker)", "8 (Visionary)", "9 (De Bruyne)", "10 (Pirlo)"];
const STAT_DRI = ["1 (Two Left Feet)", "2 (Heavy Touch)", "3 (Stiff)", "4 (Basic)", "5 (Average)", "6 (Smooth)", "7 (Agile)", "8 (Neymar)", "9 (Ronaldinho)", "10 (Messi)"];
const STAT_DEF = ["1 (Traffic Cone)", "2 (Lazy)", "3 (Statue)", "4 (Weak)", "5 (Average)", "6 (Solid)", "7 (Wall)", "8 (Maldini)", "9 (Prime VVD)", "10 (Brick Wall)"];
const STAT_PHY = ["1 (Feather)", "2 (Spaghetti)", "3 (Weak)", "4 (Below Avg)", "5 (Average)", "6 (Strong)", "7 (Tank)", "8 (Beast)", "9 (Akinfenwa)", "10 (Hulk)"];
const STAT_ARRAYS: Record<string, string[]> = { pace: STAT_PACE, shooting: STAT_SHO, passing: STAT_PAS, dribbling: STAT_DRI, defending: STAT_DEF, physicality: STAT_PHY };

const TRAITS_LIST = [
  "Mbappé Acceleration (+2 Pace)", "Ronaldo Leap (+2 Physicality)", 
  "Messi Balance (+2 Dribbling)", "De Bruyne Vision (+2 Passing)", 
  "Sniper (+2 Shooting)", "Maldini Aura (+2 Defending)",
  "Adama Traore Oil (+3 Physicality)", "Speed Demon (+2 Pace)",
  "Glass Ankles (-2 Pace)", "Lazy Defender (-2 Defending)", 
  "Heavy Touch (-2 Dribbling)", "Selfish Striker (-2 Passing)",
  "Gym Rat (+1 Physicality)", "Two-Footed (+1 Shooting)",
  "Playmaker (+2 Passing)", "Brick Wall (+2 Defending)"
];

const LEAGUES_WEIGHTED = [
  { label: "Premier League", weight: 35 }, { label: "Eredivisie", weight: 8 }, { label: "MLS", weight: 5 }, 
  { label: "La Liga", weight: 35 }, { label: "Süper Lig", weight: 8 }, { label: "Jupiler Pro League", weight: 6 }, 
  { label: "Serie A", weight: 35 }, { label: "EFL Championship", weight: 8 }, { label: "Saudi Pro League", weight: 5 }, 
  { label: "Bundesliga", weight: 35 }, { label: "Brasileirão", weight: 10 }, { label: "Primeira Liga", weight: 10 }, 
  { label: "Ligue 1", weight: 35 }, { label: "Liga MX", weight: 6 }, { label: "Scottish Prem", weight: 6 }
];

const CLUBS_DATA: Record<string, {name: string, tier: number}[]> = {
  "Premier League": [{name: "Man City", tier: 5}, {name: "Nott'm Forest", tier: 1}, {name: "Arsenal", tier: 5}, {name: "Bournemouth", tier: 1}, {name: "Liverpool", tier: 5}, {name: "Brentford", tier: 1}, {name: "Chelsea", tier: 4}, {name: "Crystal Palace", tier: 1}, {name: "Man Utd", tier: 4}, {name: "Fulham", tier: 1}, {name: "Spurs", tier: 4}, {name: "Everton", tier: 2}, {name: "Aston Villa", tier: 3}, {name: "Wolves", tier: 2}, {name: "Newcastle", tier: 3}, {name: "Brighton", tier: 2}, {name: "West Ham", tier: 3}],
  "La Liga": [{name: "Real Madrid", tier: 5}, {name: "Alaves", tier: 1}, {name: "Barcelona", tier: 5}, {name: "Mallorca", tier: 1}, {name: "Atletico", tier: 4}, {name: "Osasuna", tier: 2}, {name: "Athletic Club", tier: 3}, {name: "Valencia", tier: 2}, {name: "Villarreal", tier: 3}, {name: "Betis", tier: 3}, {name: "Girona", tier: 3}, {name: "Sevilla", tier: 3}],
  "Serie A": [{name: "Inter", tier: 5}, {name: "Monza", tier: 1}, {name: "AC Milan", tier: 4}, {name: "Torino", tier: 2}, {name: "Juventus", tier: 4}, {name: "Bologna", tier: 2}, {name: "Napoli", tier: 4}, {name: "Fiorentina", tier: 3}, {name: "Roma", tier: 3}, {name: "Lazio", tier: 3}, {name: "Atalanta", tier: 3}],
  "Bundesliga": [{name: "Bayern München", tier: 5}, {name: "Werder Bremen", tier: 1}, {name: "Leverkusen", tier: 5}, {name: "Gladbach", tier: 2}, {name: "Dortmund", tier: 4}, {name: "Union Berlin", tier: 2}, {name: "Leipzig", tier: 4}, {name: "Freiburg", tier: 2}, {name: "Frankfurt", tier: 3}, {name: "Wolfsburg", tier: 2}, {name: "Stuttgart", tier: 3}],
  "Ligue 1": [{name: "PSG", tier: 5}, {name: "Nantes", tier: 1}, {name: "Monaco", tier: 4}, {name: "Toulouse", tier: 2}, {name: "Lyon", tier: 3}, {name: "Nice", tier: 2}, {name: "Marseille", tier: 3}, {name: "Lens", tier: 3}, {name: "Lille", tier: 3}, {name: "Rennes", tier: 3}],
  "Eredivisie": [{name: "PSV", tier: 4}, {name: "Heerenveen", tier: 1}, {name: "Feyenoord", tier: 4}, {name: "NEC", tier: 1}, {name: "Ajax", tier: 3}, {name: "Go Ahead", tier: 1}, {name: "AZ", tier: 3}, {name: "Sparta", tier: 2}, {name: "FC Twente", tier: 3}, {name: "Utrecht", tier: 2}],
  "Jupiler Pro League": [{name: "Club Brugge", tier: 4}, {name: "OHL", tier: 1}, {name: "Union SG", tier: 4}, {name: "Westerlo", tier: 1}, {name: "Anderlecht", tier: 3}, {name: "Charleroi", tier: 1}, {name: "Antwerp", tier: 3}, {name: "Sint-Truiden", tier: 1}, {name: "KRC Genk", tier: 3}, {name: "KV Mechelen", tier: 2}, {name: "AA Gent", tier: 3}, {name: "Cercle Brugge", tier: 2}, {name: "Standard", tier: 2}],
  "EFL Championship": [{name: "Leeds Utd", tier: 4}, {name: "QPR", tier: 1}, {name: "Burnley", tier: 4}, {name: "Millwall", tier: 2}, {name: "Sheff Utd", tier: 4}, {name: "Luton Town", tier: 2}, {name: "Sunderland", tier: 3}, {name: "West Brom", tier: 3}],
  "Brasileirão": [{name: "Flamengo", tier: 5}, {name: "Vasco", tier: 2}, {name: "Palmeiras", tier: 5}, {name: "Santos", tier: 2}, {name: "São Paulo", tier: 4}, {name: "Botafogo", tier: 4}, {name: "Corinthians", tier: 3}, {name: "Fluminense", tier: 3}],
  "Süper Lig": [{name: "Galatasaray", tier: 4}, {name: "Başakşehir", tier: 2}, {name: "Fenerbahçe", tier: 4}, {name: "Trabzonspor", tier: 3}, {name: "Beşiktaş", tier: 4}],
  "Primeira Liga": [{name: "Sporting CP", tier: 4}, {name: "Boavista", tier: 1}, {name: "Benfica", tier: 4}, {name: "Vitoria SC", tier: 2}, {name: "FC Porto", tier: 4}, {name: "Braga", tier: 3}],
  "MLS": [{name: "Inter Miami", tier: 4}, {name: "NYC FC", tier: 2}, {name: "LAFC", tier: 4}, {name: "LA Galaxy", tier: 3}, {name: "Columbus Crew", tier: 3}, {name: "FC Cincinnati", tier: 3}],
  "Saudi Pro League": [{name: "Al Hilal", tier: 4}, {name: "Al Shabab", tier: 2}, {name: "Al Nassr", tier: 4}, {name: "Al Ittihad", tier: 3}, {name: "Al Ahli", tier: 3}],
  "Liga MX": [{name: "Club América", tier: 4}, {name: "Cruz Azul", tier: 3}, {name: "Tigres", tier: 4}, {name: "Monterrey", tier: 4}, {name: "Chivas", tier: 3}],
  "Scottish Prem": [{name: "Celtic", tier: 4}, {name: "Aberdeen", tier: 2}, {name: "Rangers", tier: 4}, {name: "Hearts", tier: 2}, {name: "Hibs", tier: 2}]
};
const EUROPEAN_CUPS = ["Champions League", "Conference League", "Europa League"];
const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16", "#eab308", "#1e40af", "#991b1b"];

// --- 2. CONFETTI COMPONENT (Zonder downloads!) ---
const SimpleConfetti = () => {
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
  const particles = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    animationDuration: (Math.random() * 2 + 2) + 's',
    animationDelay: (Math.random() * 0.2) + 's',
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    width: Math.random() * 10 + 5 + 'px',
    height: Math.random() * 10 + 5 + 'px',
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="absolute top-[-10%]"
          style={{
            left: p.left, width: p.width, height: p.height, backgroundColor: p.backgroundColor,
            animation: `confetti-fall ${p.animationDuration} ${p.animationDelay} linear forwards`,
            transform: `rotate(${p.rotation}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default function TikTokCareerSimulator() {
  const [answers, setAnswers] = useState<any>({ clubs: [], selectedTraits: [] });
  const [draftClub, setDraftClub] = useState<any>({});
  
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [result, setResult] = useState<any>(null);

  // TICKER & CONFETTI STATES
  const [tickerActive, setTickerActive] = useState(false);
  const [tickerValue, setTickerValue] = useState<number | string>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [widgetPos, setWidgetPos] = useState({ x: 20, y: 20 });
  const isDraggingWidget = useRef(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const getOverallRating = () => {
    if (!answers.pace) return 0;
    const pac = parseInt(answers.pace);
    const sho = parseInt(answers.shooting);
    const pas = parseInt(answers.passing);
    const dri = parseInt(answers.dribbling);
    const def = parseInt(answers.defending);
    const phy = parseInt(answers.physicality);
    const avg = (pac + sho + pas + dri + def + phy) / 6; 
    
    let ovr = 35 + (avg * 6.3); 
    
    // Nu we met exacte getallen werken, passen we de berekening aan
    const goalsNum = parseInt(answers.goals) || 0;
    const assistsNum = parseInt(answers.assists) || 0;
    
    if (goalsNum >= 800) ovr += 4;
    else if (goalsNum >= 500) ovr += 3;
    else if (goalsNum >= 300) ovr += 2;
    
    if (assistsNum >= 300) ovr += 3;
    else if (assistsNum >= 150) ovr += 2;

    return Math.min(99, Math.round(ovr));
  };

  const buildStep = (key: string, title: string, optionsRaw: any[]) => {
    const options = optionsRaw.map(opt => typeof opt === 'object' && opt.weight ? opt : { label: opt, weight: 10 });
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let currentAngle = 0;
    const slices = options.map(opt => {
      const angle = (opt.weight / totalWeight) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;
      const center = start + (angle / 2);
      currentAngle += angle;
      return { ...opt, start, end, angle, center };
    });
    return { key, title, slices, totalWeight };
  };

  const getStatWeighted = (statKey: string, optionsSubset: string[]) => {
    const weights = [60, 50, 40, 30, 25, 20, 15, 10, 8, 5]; 
    return optionsSubset.map(label => {
      const originalIndex = STAT_ARRAYS[statKey].indexOf(label);
      return { label, weight: weights[originalIndex] || 10 };
    });
  };

  const determineNextStep = () => {
    if (!answers.position) return buildStep('position', 'Position', POSITIONS);
    if (!answers.nationality) return buildStep('nationality', 'Nationality', NATIONALITIES);
    if (!answers.debutAge) return buildStep('debutAge', 'Pro Debut Age', AGES); 
    if (!answers.totalSeasons) return buildStep('totalSeasons', 'Total Seasons in Career?', SEASONS); 
    
    if (!answers.totalClubs) {
       const max = Math.min(answers.totalSeasons, 8);
       const options = Array.from({length: max}, (_,i) => ({ label: i + 1, weight: Math.max(5, 100 - (i * 15)) }));
       return buildStep('totalClubs', 'How many Clubs?', options);
    }
    if (!answers.height) return buildStep('height', 'Height', HEIGHTS);
    
    if (!answers.pace) return buildStep('pace', 'Pace', getStatWeighted('pace', STAT_PACE));
    if (!answers.shooting) return buildStep('shooting', 'Shooting', getStatWeighted('shooting', STAT_SHO));
    if (!answers.passing) return buildStep('passing', 'Passing', getStatWeighted('passing', STAT_PAS));
    if (!answers.dribbling) return buildStep('dribbling', 'Dribbling', getStatWeighted('dribbling', STAT_DRI));
    if (!answers.defending) return buildStep('defending', 'Defending', getStatWeighted('defending', STAT_DEF));
    if (!answers.physicality) return buildStep('physicality', 'Physicality', getStatWeighted('physicality', STAT_PHY));
    
    if (!answers.hasTraits) return buildStep('hasTraits', 'Do you have Special Traits?', [{label: 'Yes', weight: 40}, {label: 'No', weight: 60}]);
    if (answers.hasTraits === 'Yes' && !answers.traitsCount) {
       const traitOptions = [
         { label: 1, weight: 80 }, { label: 2, weight: 50 }, { label: 3, weight: 30 },
         { label: 4, weight: 15 }, { label: 5, weight: 8 }, { label: 6, weight: 4 },
         { label: 7, weight: 2 }, { label: 8, weight: 1 }
       ];
       return buildStep('traitsCount', 'How many Traits?', traitOptions);
    }
    if (answers.hasTraits === 'Yes' && answers.selectedTraits.length < answers.traitsCount) {
      const remainingTraits = TRAITS_LIST.filter(t => !answers.selectedTraits.includes(t));
      return buildStep('add_trait', `Trait #${answers.selectedTraits.length + 1}`, remainingTraits);
    }

    const seasonsPlayed = answers.clubs.reduce((sum: number, c: any) => sum + c.seasons, 0);
    if (answers.clubs.length < answers.totalClubs && seasonsPlayed < answers.totalSeasons) {
      const remaining = answers.totalSeasons - seasonsPlayed;
      const isLastClub = answers.clubs.length === answers.totalClubs - 1;
      const clubNum = answers.clubs.length + 1;
      
      if (!draftClub.league) return buildStep('draftClub_league', `Club ${clubNum}: League`, LEAGUES_WEIGHTED);
      if (!draftClub.clubObj) {
        const leagueClubs = CLUBS_DATA[draftClub.league].map(c => ({
          label: c.name, 
          weight: c.tier === 5 ? 50 : c.tier === 4 ? 35 : c.tier === 3 ? 20 : c.tier === 2 ? 10 : 5
        }));
        return buildStep('draftClub_clubObj', `Club ${clubNum}: Team`, leagueClubs);
      }
      
      if (!draftClub.seasons) {
        if (isLastClub) return buildStep('draftClub_seasons', `Seasons here? (Must be ${remaining})`, [remaining]);
        const options = Array.from({length: remaining}, (_, i) => ({ label: i + 1, weight: Math.max(5, 100 - (i * 15)) }));
        return buildStep('draftClub_seasons', `Seasons here? (Max ${remaining})`, options);
      }
      
      const tier = CLUBS_DATA[draftClub.league].find(c => c.name === draftClub.clubObj)?.tier || 1;

      const leagueDone = draftClub.wonLeague === 'No' || (draftClub.wonLeague === 'Yes' && draftClub.leagueTitlesCount !== undefined);
      if (!leagueDone) {
        if (!draftClub.wonLeague) return buildStep('draftClub_wonLeague', 'Win any League Titles?', [{label: 'No', weight: 100 - (tier*15)}, {label: 'Yes', weight: tier*15}]);
        const options = Array.from({length: draftClub.seasons}, (_, i) => ({ label: i + 1, weight: Math.max(15, 100 - (i * 20) + (tier * 5)) }));
        return buildStep('draftClub_leagueTitlesCount', 'How many times?', options);
      }

      const cupDone = draftClub.wonCup === 'No' || (draftClub.wonCup === 'Yes' && draftClub.cupTitlesCount !== undefined);
      if (!cupDone) {
        if (!draftClub.wonCup) return buildStep('draftClub_wonCup', 'Win Domestic Cups?', [{label: 'No', weight: 100 - (10+(tier*15))}, {label: 'Yes', weight: 10+(tier*15)}]);
        const options = Array.from({length: draftClub.seasons + 1}, (_, i) => ({ label: i + 1, weight: Math.max(15, 100 - (i * 20) + (tier * 5)) }));
        return buildStep('draftClub_cupTitlesCount', 'How many cups?', options);
      }
      
      const inEurope = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Eredivisie", "Jupiler Pro League", "Primeira Liga", "Süper Lig", "Scottish Prem"].includes(draftClub.league);
      const europeDone = !inEurope || draftClub.wonEurope === 'No' || (draftClub.wonEurope === 'Yes' && draftClub.europeTitlesCount !== undefined);
      if (!europeDone) {
        if (!draftClub.wonEurope) return buildStep('draftClub_wonEurope', 'Win European Cups?', [{label: 'No', weight: 100 - (tier*15)}, {label: 'Yes', weight: tier*15}]);
        if (!draftClub.europeTrophy) return buildStep('draftClub_europeTrophy', 'Which Cup?', EUROPEAN_CUPS);
        const options = Array.from({length: Math.ceil(draftClub.seasons / 2)}, (_, i) => ({ label: i + 1, weight: Math.max(15, 100 - (i * 30) + (tier * 5)) }));
        return buildStep('draftClub_europeTitlesCount', 'How many times?', options);
      }

      if (!draftClub.didImprove) {
        const yesWeight = Math.min(85, draftClub.seasons * 15);
        return buildStep('draftClub_didImprove', 'Did you improve here?', [{label: 'No', weight: 100 - yesWeight}, {label: 'Yes', weight: yesWeight}]);
      }

      if (draftClub.didImprove === 'Yes') {
        const improvementsDone = draftClub.improvementsDone || [];
        const improvableStats = Object.keys(STAT_ARRAYS).filter(stat => {
          const currentIndex = STAT_ARRAYS[stat].indexOf(answers[stat]);
          return currentIndex !== -1 && currentIndex < STAT_ARRAYS[stat].length - 1 && !improvementsDone.includes(stat);
        });

        if (improvableStats.length === 0) return { key: 'save_club', title: '', slices: [] };

        if (!draftClub.improveCount) {
          const options = Array.from({length: improvableStats.length}, (_, i) => ({
             label: i + 1, weight: Math.max(2, 100 - (i * 20)) 
          }));
          return buildStep('draftClub_improveCount', 'How many stats improved?', options);
        }

        if (improvementsDone.length < draftClub.improveCount) {
          if (!draftClub.currentImprovingStat) {
            const options = improvableStats.map(s => s.toUpperCase());
            return buildStep('draftClub_currentImprovingStat', `Which stat? (${improvementsDone.length + 1}/${draftClub.improveCount})`, options);
          } else {
            const statKey = draftClub.currentImprovingStat.toLowerCase();
            const currentIndex = STAT_ARRAYS[statKey].indexOf(answers[statKey]);
            const higherOptions = STAT_ARRAYS[statKey].slice(currentIndex + 1);
            return buildStep('improveValue', `New ${statKey.toUpperCase()} Rating?`, getStatWeighted(statKey, higherOptions));
          }
        }
      }

      return { key: 'save_club', title: '', slices: [] };
    }

    if (!answers.goals) {
      const shoLvl = parseInt(answers.shooting) || 5;
      const goalsOptions = [
        { label: "0-50", weight: Math.max(1, 100 - (shoLvl * 15)) },
        { label: "50-150", weight: Math.max(1, 80 - Math.abs(shoLvl - 3) * 15) },
        { label: "150-300", weight: Math.max(1, 80 - Math.abs(shoLvl - 5) * 15) },
        { label: "300-500", weight: Math.max(1, 80 - Math.abs(shoLvl - 7) * 15) },
        { label: "500-800", weight: Math.max(1, (shoLvl - 6) * 20) },
        { label: "800+", weight: Math.max(1, (shoLvl - 8) * 30) }
      ];
      return buildStep('goals', 'Career Goals', goalsOptions);
    }
    
    if (!answers.assists) {
      const pasLvl = parseInt(answers.passing) || 5;
      const assistsOptions = [
        { label: "0-50", weight: Math.max(1, 100 - (pasLvl * 15)) },
        { label: "50-100", weight: Math.max(1, 80 - Math.abs(pasLvl - 4) * 15) },
        { label: "100-200", weight: Math.max(1, 80 - Math.abs(pasLvl - 6) * 15) },
        { label: "200-300", weight: Math.max(1, (pasLvl - 6) * 20) },
        { label: "300+", weight: Math.max(1, (pasLvl - 8) * 30) }
      ];
      return buildStep('assists', 'Career Assists', assistsOptions);
    }

    if (!answers.wonBallonDor) {
      const currentOVR = getOverallRating();
      const goalsNum = parseInt(answers.goals) || 0;
      let bdYes = Math.max(1, (currentOVR - 70) * 3); 
      if (goalsNum >= 800) bdYes += 30;
      else if (goalsNum >= 500) bdYes += 15;
      
      let bdNo = Math.max(5, 100 - bdYes);
      return buildStep('wonBallonDor', "Win Ballon d'Or?", [{label: 'No', weight: bdNo}, {label: 'Yes', weight: bdYes}]);
    }
    
    if (answers.wonBallonDor === 'Yes' && !answers.ballonDors) return buildStep('ballonDors', "How many Ballon d'Ors?", [{label: 1, weight: 50}, {label: 2, weight: 30}, {label: 3, weight: 15}, {label: 4, weight: 5}, {label: 5, weight: 2}]);

    return null; 
  };

  useEffect(() => {
    const next = determineNextStep();
    if (next && next.key === 'save_club') {
      setAnswers((prev: any) => ({ ...prev, clubs: [...prev.clubs, draftClub] }));
      setDraftClub({});
    } else if (next) {
      setCurrentStep(next);
      setWheelRotation(-next.slices[0].center);
    }
  }, [answers, draftClub]);


  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const randomWeight = Math.random() * currentStep.totalWeight;
    let winningIndex = 0;
    let weightSum = 0;
    
    for (let i = 0; i < currentStep.slices.length; i++) {
      weightSum += currentStep.slices[i].weight;
      if (randomWeight <= weightSum) {
        winningIndex = i;
        break;
      }
    }

    const winningSlice = currentStep.slices[winningIndex];
    const extraSpins = 360 * 6;
    const padding = winningSlice.angle * 0.1; 
    const randomOffset = padding + Math.random() * (winningSlice.angle - 2 * padding);
    const targetAngle = winningSlice.start + randomOffset;

    setWheelRotation(-(extraSpins + targetAngle));

    // Wacht tot de spin klaar is
    setTimeout(() => {
      const label = winningSlice.label.toString();
      
      // Check of dit een Ticker-range is ("50-150" of "800+")
      const rangeMatch = label.match(/^(\d+)-(\d+)$/);
      const plusMatch = label.match(/^(\d+)\+$/);

      if (rangeMatch || plusMatch) {
        let min = 0, max = 0;
        if (rangeMatch) {
          min = parseInt(rangeMatch[1]);
          max = parseInt(rangeMatch[2]);
        } else if (plusMatch) {
          min = parseInt(plusMatch[1]);
          max = min + 350; 
        }

        setTickerActive(true);
        let ticks = 0;
        const interval = setInterval(() => {
          setTickerValue(Math.floor(Math.random() * (max - min + 1)) + min);
          ticks++;
          
          if (ticks > 40) { // Na ~2 seconden stoppen
            clearInterval(interval);
            const finalExactNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            setTickerValue(finalExactNumber);
            
            setTimeout(() => {
              setTickerActive(false);
              setResult(finalExactNumber.toString()); 
              triggerConfetti();
              setIsSpinning(false);
            }, 1500); // Laat het getal even staan
          }
        }, 50);

      } else {
        // Geen ticker nodig, gewoon resultaat tonen
        setIsSpinning(false);
        setResult(label);
        triggerConfetti();
      }
    }, 6000); 
  };

  const handleNext = () => {
    if (currentStep.key === 'improveValue') {
      const statKey = draftClub.currentImprovingStat.toLowerCase();
      setAnswers((prev: any) => ({ ...prev, [statKey]: result }));
      setDraftClub((prev: any) => ({
        ...prev,
        improvementsDone: [...(prev.improvementsDone || []), statKey],
        currentImprovingStat: null 
      }));
    } else if (currentStep.key.startsWith('draftClub_')) {
      setDraftClub((prev: any) => ({ ...prev, [currentStep.key.replace('draftClub_', '')]: result }));
    } else if (currentStep.key === 'add_trait') {
      setAnswers((prev: any) => {
        let newAnswers = { ...prev, selectedTraits: [...prev.selectedTraits, result] };
        const boostRegex = /([+-]\d+)\s+([A-Za-z]+)/g;
        let match;
        while ((match = boostRegex.exec(result)) !== null) {
          const amount = parseInt(match[1]);
          const statName = match[2].toLowerCase();
          if (STAT_ARRAYS[statName] && prev[statName]) {
            const currentIndex = STAT_ARRAYS[statName].indexOf(prev[statName]);
            let newIndex = currentIndex + amount;
            if (newIndex < 0) newIndex = 0;
            if (newIndex >= STAT_ARRAYS[statName].length) newIndex = STAT_ARRAYS[statName].length - 1;
            newAnswers[statName] = STAT_ARRAYS[statName][newIndex];
          }
        }
        return newAnswers;
      });
    } else {
      setAnswers((prev: any) => ({ ...prev, [currentStep.key]: result }));
    }
    setResult(null);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingWidget.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingWidget.current) return;
    setWidgetPos(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingWidget.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const renderWheel = () => {
    if (!currentStep || currentStep.slices.length === 0) return null;
    const gradientStops = currentStep.slices.map((slice: any, i: number) => `${COLORS[i % COLORS.length]} ${slice.start}deg ${slice.end}deg`).join(", ");

    return (
      <div className="relative w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] mx-auto mt-8">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-white z-40 drop-shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
        
        {/* HET RAD ZELF */}
        <div className="w-full h-full rounded-full border-[8px] border-gray-800 shadow-2xl overflow-hidden relative"
          style={{ 
            background: `conic-gradient(${gradientStops})`,
            transform: `rotate(${wheelRotation}deg)`,
            transition: isSpinning && !tickerActive ? "transform 6s cubic-bezier(0.1, 0.7, 0.1, 1)" : "none"
          }}>
          
          {currentStep.slices.map((slice: any, i: number) => (
             <div key={`line-${i}`} className="absolute top-0 left-1/2 w-[3px] h-1/2 bg-gray-900 origin-bottom z-20" style={{ transform: `translateX(-50%) rotate(${slice.start}deg)` }} />
          ))}

          {currentStep.slices.map((slice: any, i: number) => (
             <div key={`text-${i}`} className="absolute inset-0 flex justify-center items-start pt-6 z-30" style={{ transform: `rotate(${slice.center}deg)` }}>
                 <span className="text-white font-black text-[10px] sm:text-xs bg-black/60 px-1 py-0.5 rounded truncate max-w-[180px] shadow-sm border border-white/10" 
                       style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                   {slice.label}
                 </span>
             </div>
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-900 rounded-full border-[6px] border-gray-700 z-40 shadow-inner"></div>
        </div>

        {/* ZWART VAKJE / TICKER OVERLAY (Slot Machine) */}
        {tickerActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 rounded-full border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-opacity">
            <span className="text-7xl font-black text-white">{tickerValue}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {showConfetti && <SimpleConfetti />}

      <div className="w-full max-w-4xl text-center">
        {!currentStep ? (
          <div className="py-10 animate-fade-in-up flex flex-col items-center z-10 relative">
            
            <div className="relative bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-800 p-1 rounded-2xl shadow-[0_0_50px_rgba(202,138,4,0.4)] w-[300px] sm:w-[380px] mb-8">
               <div className="bg-black/90 rounded-xl p-6 border-2 border-yellow-500/50 relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4 border-b border-yellow-600/50 pb-4">
                   <div className="text-left">
                     <p className="text-6xl font-black text-white">{getOverallRating()}</p>
                     <p className="text-2xl font-bold text-yellow-500">{answers.position}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-gray-300">{answers.nationality}</p>
                     <p className="text-sm text-gray-400">{answers.totalSeasons} Seasons</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-xl">
                   <div className="flex justify-between font-bold"><span className="text-gray-400 font-normal">PAC</span> <span>{answers.pace ? answers.pace.split(' ')[0] : '0'}</span></div>
                   <div className="flex justify-between font-bold"><span className="text-gray-400 font-normal">DRI</span> <span>{answers.dribbling ? answers.dribbling.split(' ')[0] : '0'}</span></div>
                   <div className="flex justify-between font-bold"><span className="text-gray-400 font-normal">SHO</span> <span>{answers.shooting ? answers.shooting.split(' ')[0] : '0'}</span></div>
                   <div className="flex justify-between font-bold"><span className="text-gray-400 font-normal">DEF</span> <span>{answers.defending ? answers.defending.split(' ')[0] : '0'}</span></div>
                   <div className="flex justify-between font-bold"><span className="text-gray-400 font-normal">PAS</span> <span>{answers.passing ? answers.passing.split(' ')[0] : '0'}</span></div>
                   <div className="flex justify-between font-bold"><span className="text-gray-400 font-normal">PHY</span> <span>{answers.physicality ? answers.physicality.split(' ')[0] : '0'}</span></div>
                 </div>

                 <div className="bg-yellow-900/30 rounded p-3 text-center border border-yellow-600/30">
                    <p className="font-black text-yellow-500">⚽ {answers.goals} Goals</p>
                    <p className="font-black text-yellow-500">🎯 {answers.assists} Assists</p>
                    {answers.wonBallonDor === 'Yes' && <p className="font-black text-white mt-1">🥇 {answers.ballonDors}x Ballon d'Or</p>}
                 </div>
               </div>
            </div>

            <button onClick={() => window.location.reload()} className="bg-white text-black font-black py-4 px-12 rounded-full hover:scale-105 transition-transform text-xl">Start New Simulation</button>
          </div>
        ) : (
          <>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight drop-shadow-lg z-10 relative">{currentStep.title}</h2>
            {renderWheel()}

            <div className="mt-12 h-32 flex items-center justify-center flex-col z-10 relative">
              {!result && !isSpinning && (
                <button onClick={spinWheel} className="bg-blue-600 hover:bg-blue-500 text-white font-black text-4xl py-5 px-20 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-all active:scale-95 border-4 border-blue-400">
                  SPIN!
                </button>
              )}
              {isSpinning && !tickerActive && <p className="text-3xl font-black animate-pulse text-yellow-400 uppercase tracking-widest">Ticking...</p>}
              {tickerActive && <p className="text-3xl font-black text-green-400 uppercase tracking-widest">Calculating...</p>}
              {result && (
                <div className="text-center animate-bounce">
                  <p className="text-xl text-gray-400 font-bold mb-2">Result:</p>
                  <p className="text-5xl font-black text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">{result}</p>
                  <button onClick={handleNext} className="bg-white text-black font-black py-3 px-12 rounded-full text-xl hover:bg-gray-200">Next Step</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isStatsOpen ? (
        <div 
          className="fixed z-40 bg-gray-900/95 backdrop-blur-md rounded-xl border-2 border-gray-700 shadow-2xl flex flex-col"
          style={{ top: widgetPos.y, left: widgetPos.x, width: '320px', minHeight: '200px', maxHeight: '80vh', resize: 'both', overflow: 'hidden' }}
        >
          <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} className="bg-gray-800 p-3 cursor-move flex justify-between items-center border-b border-gray-700 select-none touch-none">
            <span className="font-bold text-gray-300">📊 Live Career</span>
            <button onClick={() => setIsStatsOpen(false)} className="text-gray-400 hover:text-white px-2 text-xl font-bold">_</button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 text-sm space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black p-2 rounded border border-gray-800"><span className="text-gray-500 block">Height</span> <span className="font-bold">{answers.height ? answers.height.split('/')[0].trim() : '?'}</span></div>
              <div className="bg-black p-2 rounded border border-gray-800"><span className="text-gray-500 block">Seasons</span> <span className="font-bold">{answers.totalSeasons || '?'}</span></div>
              <div className="bg-black p-2 rounded border border-gray-800"><span className="text-gray-500 block">Pos</span> <span className="font-bold">{answers.position || '?'}</span></div>
              <div className="bg-black p-2 rounded border border-gray-800"><span className="text-gray-500 block">Clubs</span> <span className="font-bold">{answers.totalClubs || '?'}</span></div>
            </div>

            {answers.selectedTraits.length > 0 && (
              <div className="bg-purple-900/30 p-2 rounded border border-purple-800 text-xs">
                <span className="text-purple-400 font-bold uppercase block mb-1">Traits ({answers.selectedTraits.length}/{answers.traitsCount})</span>
                {answers.selectedTraits.map((t: string, i: number) => <div key={i}>• {t}</div>)}
              </div>
            )}

            <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
              <div className="bg-black p-1 border border-gray-800"><span className="text-gray-500 block">PAC</span><span className="font-bold text-blue-400 truncate block">{answers.pace ? answers.pace.split(' ')[0] : '-'}</span></div>
              <div className="bg-black p-1 border border-gray-800"><span className="text-gray-500 block">SHO</span><span className="font-bold text-blue-400 truncate block">{answers.shooting ? answers.shooting.split(' ')[0] : '-'}</span></div>
              <div className="bg-black p-1 border border-gray-800"><span className="text-gray-500 block">PAS</span><span className="font-bold text-blue-400 truncate block">{answers.passing ? answers.passing.split(' ')[0] : '-'}</span></div>
              <div className="bg-black p-1 border border-gray-800"><span className="text-gray-500 block">DRI</span><span className="font-bold text-blue-400 truncate block">{answers.dribbling ? answers.dribbling.split(' ')[0] : '-'}</span></div>
              <div className="bg-black p-1 border border-gray-800"><span className="text-gray-500 block">DEF</span><span className="font-bold text-blue-400 truncate block">{answers.defending ? answers.defending.split(' ')[0] : '-'}</span></div>
              <div className="bg-black p-1 border border-gray-800"><span className="text-gray-500 block">PHY</span><span className="font-bold text-blue-400 truncate block">{answers.physicality ? answers.physicality.split(' ')[0] : '-'}</span></div>
            </div>

            {answers.clubs.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Club History</h4>
                {answers.clubs.map((c: any, i: number) => (
                  <div key={i} className="bg-black p-2 rounded border border-gray-700 text-xs">
                    <p className="font-black text-green-400 truncate">{c.clubObj} <span className="text-gray-500 font-normal">({c.seasons}y)</span></p>
                    <p className="text-gray-400 mt-1">🥇 {c.leagueTitlesCount || 0} | 🏆 {c.cupTitlesCount || 0} | 🌍 {c.europeTitlesCount || 0}</p>
                  </div>
                ))}
              </div>
            )}

            {draftClub.league && (
              <div className="bg-gray-800 border-l-2 border-yellow-500 p-2 rounded text-xs">
                <p className="text-yellow-500 uppercase font-bold text-[10px]">Current Club</p>
                <p className="font-bold truncate">{draftClub.clubObj || 'Spinning...'}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={() => setIsStatsOpen(true)} className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full border-2 border-gray-600 shadow-xl z-50 flex items-center gap-2">
          📊 <span className="hidden sm:inline">Open Career Stats</span>
        </button>
      )}
    </div>
  );
}