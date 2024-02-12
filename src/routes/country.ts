import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  const key = process.env.COUNTRY_KEY;

  if (!name) {
    return res.status(400).send("A country name is required");
  }

  try {
    const countryInfoResponse = await fetch(
      `https://restcountries.com/v3.1/name/${name}`
    );

    if (!countryInfoResponse.ok) {
      throw new Error("Country not found");
    }
    const countries = await countryInfoResponse.json();
    const country = countries[0];

    const currencyCode = Object.keys(country.currencies)[0];
    const currencyInfo = country.currencies[currencyCode];

    const conversionResponse = await fetch(
      `http://data.fixer.io/api/latest?access_key=${key}&symbols=${currencyCode}, SEK`
    );

    const conversionData = await conversionResponse.json();
    if (!conversionData.success) {
      throw new Error("Failed to fetch conversion rates");
    }

    const rateEURtoSEK = conversionData.rates["SEK"];
    const rateEURtoTarget = conversionData.rates[currencyCode];
    let conversionRateToTarget = rateEURtoTarget / rateEURtoSEK;
    if (currencyCode === "EUR") {
      conversionRateToTarget = rateEURtoSEK;
    }
    const responseStructure = {
      officialName: country.name.official,
      commonName: country.name.common,
      population: country.population,
      currency: {
        code: currencyCode,
        name: currencyInfo.name,
        symbol: currencyInfo.symbol,
        conversionRateToSEK: conversionRateToTarget,
      },
    };

    res.json(responseStructure);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).send(error.message);
    } else {
      return res.status(500).send("An error occurred");
    }
  }
});

export default router;
