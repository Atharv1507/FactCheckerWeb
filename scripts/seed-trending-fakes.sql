-- Insert trending fake claims with low confidence ratings (10-15%)
INSERT INTO fake_checks (claim, result, confidence, is_fake) VALUES
(
  'A doctored video shows the US President being arrested.',
  'This is false. The video was synthetically generated using AI (a deepfake) or was an out-of-context clip from a different event. Official sources and the President''s public schedule confirm no such event occurred.',
  12,
  true
),
(
  'This photo shows a shark swimming on a flooded city highway after a recent hurricane.',
  'This is false. This is a well-known, digitally altered image that has been circulating online since at least 2011. It reappears during almost every major flooding event.',
  15,
  true
),
(
  'Breathing in hot air from a sauna or hair dryer will kill the virus that causes COVID-19.',
  'This is false. The internal temperature required to kill the virus would also severely damage your own body''s cells and respiratory tract. Medical authorities like the WHO have debunked this claim.',
  11,
  true
),
(
  'A new ''Chhath Puja Subsidy'' from the India Post is giving every citizen ₹20,000.',
  'This is false. This is a phishing scam circulating on social media. The Press Information Bureau (PIB) Fact Check unit has confirmed it is fraudulent and designed to steal personal and financial information.',
  14,
  true
),
(
  'Scientists have just discovered a ''Godzilla-sized'' 300-foot-tall penguin frozen in Antarctica.',
  'This is false. This claim originated from a satirical article. No such discovery has been announced by any credible scientific institution. The largest known penguin species, the ''colossus penguin'', stood about 6.6 feet tall.',
  13,
  true
),
(
  'The U.S. government has admitted that the 1969 moon landing was faked.',
  'This is false. No such admission has been made. The moon landing is one of the most well-documented events in history, with extensive physical evidence (like moon rocks) and corroboration from other nations.',
  10,
  true
),
(
  'Michelle Obama''s official portrait was destroyed during recent White House renovations.',
  'This is false. A White House spokesperson confirmed the portrait is safe and was never in the part of the building being renovated. This rumor was based on a misunderstanding of the construction project.',
  15,
  true
),
(
  'Japan has banned all COVID-19 vaccines and is suing the manufacturers.',
  'This is false. Japan has not banned the vaccines. This claim misinterprets a lawsuit filed by private citizens, which is not a government action. The vaccines are still part of Japan''s public health recommendations.',
  12,
  true
),
(
  'A viral video shows Hurricane Melissa hitting Jamaica on Oct. 26, 2025.',
  'This is false. There was no ''Hurricane Melissa'' on that date. The video is from a different storm in a different location, and the name ''Melissa'' is not on the 2025 list of Atlantic hurricane names.',
  14,
  true
),
(
  'The Eiffel Tower is being torn down to make way for a new stadium for the 2028 Olympics.',
  'This is false. The Eiffel Tower is an iconic, protected monument. This is a recurring rumor with no basis in fact. The 2028 Olympics are being held in Los Angeles, not Paris.',
  11,
  true
);
