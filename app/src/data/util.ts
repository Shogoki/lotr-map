export class ShireDate {
    private year: number;
    private month: number;
    private day: number|SpecialDay;
    private isSpecialDay: boolean = false; 
    private _specialDays = [
        "1Lithe",
        "2Lithe",
        "Midyearsday",
        "Overlithe",
        "1Yule",
        "2Yule"
    ]
    public constructor(dateStr: string) {
        const parts = dateStr.split("-");
        if(parts.length == 2 && this._specialDays.includes(parts[1])) {
            this.isSpecialDay = true;
        }
        if (parts.length != 3 ) {
            throw new Error(`Invalid Date Format! Given ${dateStr}`)
        }
        this.year = parseInt(parts[0]);
        if(isNaN(this.year))
            throw new Error(`Invalid Year Format ! Given ${parts[0]}`)
        if(this.isSpecialDay)
        {
            this.day = parts[1] as SpecialDay;
        }
        else {
            this.month = parseInt(parts[1]);
            this.day = parseInt(parts[2])
            if(isNaN(this.month))
                throw new Error(`Invalid Month Format! Given ${parts[1]}`)
            if(isNaN(this.day))
                throw new Error(`Invalid Day Format! Given ${parts[2]}`)
        }
    }

    public compareTo(other: ShireDate) {
        //comparing date 

        if (this.year <  other.year) 
            return -1
        else if(this.year > other.year)
            return 1
        else {
            if(this.isSpecialDay || other.isSpecialDay)
                return 0 //TODO IMPLEMENT ORDER
            else {
                if (this.month < other.month)
                    return -1
                else if ( this.month > other.month )
                    return 1
                else {
                    if(this.day < other.day) 
                        return -1
                    else if (this.day > other.day)
                        return 1
                    else
                        return 0
                }
            }
        }
    }
    public toString(): string {
        const afterYear = this.isSpecialDay ? `${this.day}` : `${this.month}-${this.day}` 
        return `${this.year}-${afterYear}`
    }
}

type SpecialDay = "1Lithe"|"2Lithe"|"Midyearsday"|"Overlithe"|"1Yule"|"2Yule"