import { add } from "date-fns";

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

export const thirtyDaysFromNow = (): Date =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const fourtyFiveMinutesFromNow = (): Date => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 45);
    return now
}

export const calculateExpirationDate = (expiresIn: string = "15m"): Date => {
    const match = expiresIn.match(/^(\d+)([mhd])$/);
    if (!match) throw new Error("Invalid expiration date format. Use '15m', '1h', '2d' etc.");
    const [, value, unit] = match;
    const expirationDate = new Date();

    switch (unit) {
        case "m":
            return add(expirationDate, { minutes: parseInt(value) });
        case "h":
            return add(expirationDate, { hours: parseInt(value) });
        case "d":
            return add(expirationDate, { days: parseInt(value) });
        default:
            throw new Error("Invlaid unit. Use 'm', 'h', 'd'");
    }
}