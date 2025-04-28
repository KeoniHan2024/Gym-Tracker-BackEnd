import { weightSet } from "../types/express";



// gets a weight set
export function averageWeightPerRep(sets: weightSet[]) {
    
    const setsGroupedByDate: {[date: string] : weightSet[] } = {};
    sets.forEach(set => {
        const workoutDate = new Date(set.date_worked).toISOString().split('T')[0];
        set.date_worked = workoutDate
        if (!setsGroupedByDate[workoutDate]) {
            setsGroupedByDate[workoutDate] = [];
          }
          setsGroupedByDate[workoutDate].push(set);
    })
    
    return setsGroupedByDate
}


export function groupSets(sets:any) {


}