const countriesArray = [
  {
    name: "South Georgia",
    continent: "Antarctica",
    flags: {
      png: "https://flagcdn.com/w320/gs.png",
      svg: "https://flagcdn.com/gs.svg",
    },
    code: "GS",
  },
  {
    name: "Grenada",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/gd.png",
      svg: "https://flagcdn.com/gd.svg",
    },
    code: "GD",
  },
  {
    name: "Switzerland",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ch.png",
      svg: "https://flagcdn.com/ch.svg",
    },
    code: "CH",
  },
  {
    name: "Sierra Leone",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/sl.png",
      svg: "https://flagcdn.com/sl.svg",
    },
    code: "SL",
  },
  {
    name: "Hungary",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/hu.png",
      svg: "https://flagcdn.com/hu.svg",
    },
    code: "HU",
  },
  {
    name: "Taiwan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/tw.png",
      svg: "https://flagcdn.com/tw.svg",
    },
    code: "TW",
  },
  {
    name: "Wallis and Futuna",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/wf.png",
      svg: "https://flagcdn.com/wf.svg",
    },
    code: "WF",
  },
  {
    name: "Barbados",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/bb.png",
      svg: "https://flagcdn.com/bb.svg",
    },
    code: "BB",
  },
  {
    name: "Pitcairn Islands",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/pn.png",
      svg: "https://flagcdn.com/pn.svg",
    },
    code: "PN",
  },
  {
    name: "Ivory Coast",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ci.png",
      svg: "https://flagcdn.com/ci.svg",
    },
    code: "CI",
  },
  {
    name: "Tunisia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/tn.png",
      svg: "https://flagcdn.com/tn.svg",
    },
    code: "TN",
  },
  {
    name: "Italy",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/it.png",
      svg: "https://flagcdn.com/it.svg",
    },
    code: "IT",
  },
  {
    name: "Benin",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/bj.png",
      svg: "https://flagcdn.com/bj.svg",
    },
    code: "BJ",
  },
  {
    name: "Indonesia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/id.png",
      svg: "https://flagcdn.com/id.svg",
    },
    code: "ID",
  },
  {
    name: "Cape Verde",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/cv.png",
      svg: "https://flagcdn.com/cv.svg",
    },
    code: "CV",
  },
  {
    name: "Saint Kitts and Nevis",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/kn.png",
      svg: "https://flagcdn.com/kn.svg",
    },
    code: "KN",
  },
  {
    name: "Laos",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/la.png",
      svg: "https://flagcdn.com/la.svg",
    },
    code: "LA",
  },
  {
    name: "Caribbean Netherlands",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/bq.png",
      svg: "https://flagcdn.com/bq.svg",
    },
    code: "BQ",
  },
  {
    name: "Uganda",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ug.png",
      svg: "https://flagcdn.com/ug.svg",
    },
    code: "UG",
  },
  {
    name: "Andorra",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ad.png",
      svg: "https://flagcdn.com/ad.svg",
    },
    code: "AD",
  },
  {
    name: "Burundi",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/bi.png",
      svg: "https://flagcdn.com/bi.svg",
    },
    code: "BI",
  },
  {
    name: "South Africa",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/za.png",
      svg: "https://flagcdn.com/za.svg",
    },
    code: "ZA",
  },
  {
    name: "France",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/fr.png",
      svg: "https://flagcdn.com/fr.svg",
    },
    code: "FR",
  },
  {
    name: "Libya",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ly.png",
      svg: "https://flagcdn.com/ly.svg",
    },
    code: "LY",
  },
  {
    name: "Mexico",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/mx.png",
      svg: "https://flagcdn.com/mx.svg",
    },
    code: "MX",
  },
  {
    name: "Gabon",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ga.png",
      svg: "https://flagcdn.com/ga.svg",
    },
    code: "GA",
  },
  {
    name: "Northern Mariana Islands",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/mp.png",
      svg: "https://flagcdn.com/mp.svg",
    },
    code: "MP",
  },
  {
    name: "North Macedonia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/mk.png",
      svg: "https://flagcdn.com/mk.svg",
    },
    code: "MK",
  },
  {
    name: "China",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/cn.png",
      svg: "https://flagcdn.com/cn.svg",
    },
    code: "CN",
  },
  {
    name: "Yemen",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/ye.png",
      svg: "https://flagcdn.com/ye.svg",
    },
    code: "YE",
  },
  {
    name: "Saint Barthélemy",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/bl.png",
      svg: "https://flagcdn.com/bl.svg",
    },
    code: "BL",
  },
  {
    name: "Guernsey",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/gg.png",
      svg: "https://flagcdn.com/gg.svg",
    },
    code: "GG",
  },
  {
    name: "Solomon Islands",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/sb.png",
      svg: "https://flagcdn.com/sb.svg",
    },
    code: "SB",
  },
  {
    name: "Svalbard and Jan Mayen",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/sj.png",
      svg: "https://flagcdn.com/sj.svg",
    },
    code: "SJ",
  },
  {
    name: "Faroe Islands",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/fo.png",
      svg: "https://flagcdn.com/fo.svg",
    },
    code: "FO",
  },
  {
    name: "Uzbekistan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/uz.png",
      svg: "https://flagcdn.com/uz.svg",
    },
    code: "UZ",
  },
  {
    name: "Egypt",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/eg.png",
      svg: "https://flagcdn.com/eg.svg",
    },
    code: "EG",
  },
  {
    name: "Senegal",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/sn.png",
      svg: "https://flagcdn.com/sn.svg",
    },
    code: "SN",
  },
  {
    name: "Sri Lanka",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/lk.png",
      svg: "https://flagcdn.com/lk.svg",
    },
    code: "LK",
  },
  {
    name: "Palestine",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/ps.png",
      svg: "https://flagcdn.com/ps.svg",
    },
    code: "PS",
  },
  {
    name: "Bangladesh",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/bd.png",
      svg: "https://flagcdn.com/bd.svg",
    },
    code: "BD",
  },
  {
    name: "Peru",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/pe.png",
      svg: "https://flagcdn.com/pe.svg",
    },
    code: "PE",
  },
  {
    name: "Singapore",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/sg.png",
      svg: "https://flagcdn.com/sg.svg",
    },
    code: "SG",
  },
  {
    name: "Turkey",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/tr.png",
      svg: "https://flagcdn.com/tr.svg",
    },
    code: "TR",
  },
  {
    name: "Afghanistan",
    continent: "Asia",
    flags: {
      png: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
      svg: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg",
    },
    code: "AF",
  },
  {
    name: "Aruba",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/aw.png",
      svg: "https://flagcdn.com/aw.svg",
    },
    code: "AW",
  },
  {
    name: "Cook Islands",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/ck.png",
      svg: "https://flagcdn.com/ck.svg",
    },
    code: "CK",
  },
  {
    name: "United Kingdom",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/gb.png",
      svg: "https://flagcdn.com/gb.svg",
    },
    code: "GB",
  },
  {
    name: "Zambia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/zm.png",
      svg: "https://flagcdn.com/zm.svg",
    },
    code: "ZM",
  },
  {
    name: "Finland",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/fi.png",
      svg: "https://flagcdn.com/fi.svg",
    },
    code: "FI",
  },
  {
    name: "Niger",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ne.png",
      svg: "https://flagcdn.com/ne.svg",
    },
    code: "NE",
  },
  {
    name: "Christmas Island",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/cx.png",
      svg: "https://flagcdn.com/cx.svg",
    },
    code: "CX",
  },
  {
    name: "Tokelau",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/tk.png",
      svg: "https://flagcdn.com/tk.svg",
    },
    code: "TK",
  },
  {
    name: "Guinea-Bissau",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/gw.png",
      svg: "https://flagcdn.com/gw.svg",
    },
    code: "GW",
  },
  {
    name: "Azerbaijan",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/az.png",
      svg: "https://flagcdn.com/az.svg",
    },
    code: "AZ",
  },
  {
    name: "Réunion",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/re.png",
      svg: "https://flagcdn.com/re.svg",
    },
    code: "RE",
  },
  {
    name: "Djibouti",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/dj.png",
      svg: "https://flagcdn.com/dj.svg",
    },
    code: "DJ",
  },
  {
    name: "North Korea",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/kp.png",
      svg: "https://flagcdn.com/kp.svg",
    },
    code: "KP",
  },
  {
    name: "Mauritius",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/mu.png",
      svg: "https://flagcdn.com/mu.svg",
    },
    code: "MU",
  },
  {
    name: "Montserrat",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ms.png",
      svg: "https://flagcdn.com/ms.svg",
    },
    code: "MS",
  },
  {
    name: "United States Virgin Islands",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/vi.png",
      svg: "https://flagcdn.com/vi.svg",
    },
    code: "VI",
  },
  {
    name: "Colombia",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/co.png",
      svg: "https://flagcdn.com/co.svg",
    },
    code: "CO",
  },
  {
    name: "Greece",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/gr.png",
      svg: "https://flagcdn.com/gr.svg",
    },
    code: "GR",
  },
  {
    name: "Croatia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/hr.png",
      svg: "https://flagcdn.com/hr.svg",
    },
    code: "HR",
  },
  {
    name: "Morocco",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ma.png",
      svg: "https://flagcdn.com/ma.svg",
    },
    code: "MA",
  },
  {
    name: "Algeria",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/dz.png",
      svg: "https://flagcdn.com/dz.svg",
    },
    code: "DZ",
  },
  {
    name: "Antarctica",
    continent: "Antarctica",
    flags: {
      png: "https://flagcdn.com/w320/aq.png",
      svg: "https://flagcdn.com/aq.svg",
    },
    code: "AQ",
  },
  {
    name: "Netherlands",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/nl.png",
      svg: "https://flagcdn.com/nl.svg",
    },
    code: "NL",
  },
  {
    name: "Sudan",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/sd.png",
      svg: "https://flagcdn.com/sd.svg",
    },
    code: "SD",
  },
  {
    name: "Fiji",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/fj.png",
      svg: "https://flagcdn.com/fj.svg",
    },
    code: "FJ",
  },
  {
    name: "Liechtenstein",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/li.png",
      svg: "https://flagcdn.com/li.svg",
    },
    code: "LI",
  },
  {
    name: "Nepal",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/np.png",
      svg: "https://flagcdn.com/np.svg",
    },
    code: "NP",
  },
  {
    name: "Puerto Rico",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/pr.png",
      svg: "https://flagcdn.com/pr.svg",
    },
    code: "PR",
  },
  {
    name: "Georgia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/ge.png",
      svg: "https://flagcdn.com/ge.svg",
    },
    code: "GE",
  },
  {
    name: "Pakistan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/pk.png",
      svg: "https://flagcdn.com/pk.svg",
    },
    code: "PK",
  },
  {
    name: "Monaco",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/mc.png",
      svg: "https://flagcdn.com/mc.svg",
    },
    code: "MC",
  },
  {
    name: "Botswana",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/bw.png",
      svg: "https://flagcdn.com/bw.svg",
    },
    code: "BW",
  },
  {
    name: "Lebanon",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/lb.png",
      svg: "https://flagcdn.com/lb.svg",
    },
    code: "LB",
  },
  {
    name: "Papua New Guinea",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/pg.png",
      svg: "https://flagcdn.com/pg.svg",
    },
    code: "PG",
  },
  {
    name: "Mayotte",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/yt.png",
      svg: "https://flagcdn.com/yt.svg",
    },
    code: "YT",
  },
  {
    name: "Dominican Republic",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/do.png",
      svg: "https://flagcdn.com/do.svg",
    },
    code: "DO",
  },
  {
    name: "Norfolk Island",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/nf.png",
      svg: "https://flagcdn.com/nf.svg",
    },
    code: "NF",
  },
  {
    name: "Bouvet Island",
    continent: "Antarctica",
    flags: {
      png: "https://flagcdn.com/w320/bv.png",
      svg: "https://flagcdn.com/bv.svg",
    },
    code: "BV",
  },
  {
    name: "Qatar",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/qa.png",
      svg: "https://flagcdn.com/qa.svg",
    },
    code: "QA",
  },
  {
    name: "Madagascar",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/mg.png",
      svg: "https://flagcdn.com/mg.svg",
    },
    code: "MG",
  },
  {
    name: "India",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/in.png",
      svg: "https://flagcdn.com/in.svg",
    },
    code: "IN",
  },
  {
    name: "Syria",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/sy.png",
      svg: "https://flagcdn.com/sy.svg",
    },
    code: "SY",
  },
  {
    name: "Montenegro",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/me.png",
      svg: "https://flagcdn.com/me.svg",
    },
    code: "ME",
  },
  {
    name: "Eswatini",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/sz.png",
      svg: "https://flagcdn.com/sz.svg",
    },
    code: "SZ",
  },
  {
    name: "Paraguay",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/py.png",
      svg: "https://flagcdn.com/py.svg",
    },
    code: "PY",
  },
  {
    name: "El Salvador",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/sv.png",
      svg: "https://flagcdn.com/sv.svg",
    },
    code: "SV",
  },
  {
    name: "Ukraine",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ua.png",
      svg: "https://flagcdn.com/ua.svg",
    },
    code: "UA",
  },
  {
    name: "Isle of Man",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/im.png",
      svg: "https://flagcdn.com/im.svg",
    },
    code: "IM",
  },
  {
    name: "Namibia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/na.png",
      svg: "https://flagcdn.com/na.svg",
    },
    code: "NA",
  },
  {
    name: "United Arab Emirates",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/ae.png",
      svg: "https://flagcdn.com/ae.svg",
    },
    code: "AE",
  },
  {
    name: "Bulgaria",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/bg.png",
      svg: "https://flagcdn.com/bg.svg",
    },
    code: "BG",
  },
  {
    name: "Greenland",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/gl.png",
      svg: "https://flagcdn.com/gl.svg",
    },
    code: "GL",
  },
  {
    name: "Germany",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/de.png",
      svg: "https://flagcdn.com/de.svg",
    },
    code: "DE",
  },
  {
    name: "Cambodia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/kh.png",
      svg: "https://flagcdn.com/kh.svg",
    },
    code: "KH",
  },
  {
    name: "Iraq",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/iq.png",
      svg: "https://flagcdn.com/iq.svg",
    },
    code: "IQ",
  },
  {
    name: "French Southern and Antarctic Lands",
    continent: "Antarctica",
    flags: {
      png: "https://flagcdn.com/w320/tf.png",
      svg: "https://flagcdn.com/tf.svg",
    },
    code: "TF",
  },
  {
    name: "Sweden",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/se.png",
      svg: "https://flagcdn.com/se.svg",
    },
    code: "SE",
  },
  {
    name: "Cuba",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/cu.png",
      svg: "https://flagcdn.com/cu.svg",
    },
    code: "CU",
  },
  {
    name: "Kyrgyzstan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/kg.png",
      svg: "https://flagcdn.com/kg.svg",
    },
    code: "KG",
  },
  {
    name: "Russia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ru.png",
      svg: "https://flagcdn.com/ru.svg",
    },
    code: "RU",
  },
  {
    name: "Malaysia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/my.png",
      svg: "https://flagcdn.com/my.svg",
    },
    code: "MY",
  },
  {
    name: "São Tomé and Príncipe",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/st.png",
      svg: "https://flagcdn.com/st.svg",
    },
    code: "ST",
  },
  {
    name: "Cyprus",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/cy.png",
      svg: "https://flagcdn.com/cy.svg",
    },
    code: "CY",
  },
  {
    name: "Canada",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ca.png",
      svg: "https://flagcdn.com/ca.svg",
    },
    code: "CA",
  },
  {
    name: "Malawi",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/mw.png",
      svg: "https://flagcdn.com/mw.svg",
    },
    code: "MW",
  },
  {
    name: "Saudi Arabia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/sa.png",
      svg: "https://flagcdn.com/sa.svg",
    },
    code: "SA",
  },
  {
    name: "Bosnia and Herzegovina",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ba.png",
      svg: "https://flagcdn.com/ba.svg",
    },
    code: "BA",
  },
  {
    name: "Ethiopia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/et.png",
      svg: "https://flagcdn.com/et.svg",
    },
    code: "ET",
  },
  {
    name: "Spain",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/es.png",
      svg: "https://flagcdn.com/es.svg",
    },
    code: "ES",
  },
  {
    name: "Slovenia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/si.png",
      svg: "https://flagcdn.com/si.svg",
    },
    code: "SI",
  },
  {
    name: "Oman",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/om.png",
      svg: "https://flagcdn.com/om.svg",
    },
    code: "OM",
  },
  {
    name: "Saint Pierre and Miquelon",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/pm.png",
      svg: "https://flagcdn.com/pm.svg",
    },
    code: "PM",
  },
  {
    name: "Macau",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/mo.png",
      svg: "https://flagcdn.com/mo.svg",
    },
    code: "MO",
  },
  {
    name: "San Marino",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/sm.png",
      svg: "https://flagcdn.com/sm.svg",
    },
    code: "SM",
  },
  {
    name: "Lesotho",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ls.png",
      svg: "https://flagcdn.com/ls.svg",
    },
    code: "LS",
  },
  {
    name: "Marshall Islands",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/mh.png",
      svg: "https://flagcdn.com/mh.svg",
    },
    code: "MH",
  },
  {
    name: "Sint Maarten",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/sx.png",
      svg: "https://flagcdn.com/sx.svg",
    },
    code: "SX",
  },
  {
    name: "Iceland",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/is.png",
      svg: "https://flagcdn.com/is.svg",
    },
    code: "IS",
  },
  {
    name: "Luxembourg",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/lu.png",
      svg: "https://flagcdn.com/lu.svg",
    },
    code: "LU",
  },
  {
    name: "Argentina",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/ar.png",
      svg: "https://flagcdn.com/ar.svg",
    },
    code: "AR",
  },
  {
    name: "Turks and Caicos Islands",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/tc.png",
      svg: "https://flagcdn.com/tc.svg",
    },
    code: "TC",
  },
  {
    name: "Nauru",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/nr.png",
      svg: "https://flagcdn.com/nr.svg",
    },
    code: "NR",
  },
  {
    name: "Cocos (Keeling) Islands",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/cc.png",
      svg: "https://flagcdn.com/cc.svg",
    },
    code: "CC",
  },
  {
    name: "Western Sahara",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/eh.png",
      svg: "https://flagcdn.com/eh.svg",
    },
    code: "EH",
  },
  {
    name: "Dominica",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/dm.png",
      svg: "https://flagcdn.com/dm.svg",
    },
    code: "DM",
  },
  {
    name: "Costa Rica",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/cr.png",
      svg: "https://flagcdn.com/cr.svg",
    },
    code: "CR",
  },
  {
    name: "Australia",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/au.png",
      svg: "https://flagcdn.com/au.svg",
    },
    code: "AU",
  },
  {
    name: "Thailand",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/th.png",
      svg: "https://flagcdn.com/th.svg",
    },
    code: "TH",
  },
  {
    name: "Haiti",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ht.png",
      svg: "https://flagcdn.com/ht.svg",
    },
    code: "HT",
  },
  {
    name: "Tuvalu",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/tv.png",
      svg: "https://flagcdn.com/tv.svg",
    },
    code: "TV",
  },
  {
    name: "Honduras",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/hn.png",
      svg: "https://flagcdn.com/hn.svg",
    },
    code: "HN",
  },
  {
    name: "Equatorial Guinea",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/gq.png",
      svg: "https://flagcdn.com/gq.svg",
    },
    code: "GQ",
  },
  {
    name: "Saint Lucia",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/lc.png",
      svg: "https://flagcdn.com/lc.svg",
    },
    code: "LC",
  },
  {
    name: "French Polynesia",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/pf.png",
      svg: "https://flagcdn.com/pf.svg",
    },
    code: "PF",
  },
  {
    name: "Belarus",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/by.png",
      svg: "https://flagcdn.com/by.svg",
    },
    code: "BY",
  },
  {
    name: "Latvia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/lv.png",
      svg: "https://flagcdn.com/lv.svg",
    },
    code: "LV",
  },
  {
    name: "Palau",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/pw.png",
      svg: "https://flagcdn.com/pw.svg",
    },
    code: "PW",
  },
  {
    name: "Guadeloupe",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/gp.png",
      svg: "https://flagcdn.com/gp.svg",
    },
    code: "GP",
  },
  {
    name: "Philippines",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/ph.png",
      svg: "https://flagcdn.com/ph.svg",
    },
    code: "PH",
  },
  {
    name: "Gibraltar",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/gi.png",
      svg: "https://flagcdn.com/gi.svg",
    },
    code: "GI",
  },
  {
    name: "Denmark",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/dk.png",
      svg: "https://flagcdn.com/dk.svg",
    },
    code: "DK",
  },
  {
    name: "Cameroon",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/cm.png",
      svg: "https://flagcdn.com/cm.svg",
    },
    code: "CM",
  },
  {
    name: "Guinea",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/gn.png",
      svg: "https://flagcdn.com/gn.svg",
    },
    code: "GN",
  },
  {
    name: "Bahrain",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/bh.png",
      svg: "https://flagcdn.com/bh.svg",
    },
    code: "BH",
  },
  {
    name: "Suriname",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/sr.png",
      svg: "https://flagcdn.com/sr.svg",
    },
    code: "SR",
  },
  {
    name: "DR Congo",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/cd.png",
      svg: "https://flagcdn.com/cd.svg",
    },
    code: "CD",
  },
  {
    name: "Somalia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/so.png",
      svg: "https://flagcdn.com/so.svg",
    },
    code: "SO",
  },
  {
    name: "Czechia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/cz.png",
      svg: "https://flagcdn.com/cz.svg",
    },
    code: "CZ",
  },
  {
    name: "New Caledonia",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/nc.png",
      svg: "https://flagcdn.com/nc.svg",
    },
    code: "NC",
  },
  {
    name: "Vanuatu",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/vu.png",
      svg: "https://flagcdn.com/vu.svg",
    },
    code: "VU",
  },
  {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/sh.png",
      svg: "https://flagcdn.com/sh.svg",
    },
    code: "SH",
  },
  {
    name: "Togo",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/tg.png",
      svg: "https://flagcdn.com/tg.svg",
    },
    code: "TG",
  },
  {
    name: "British Virgin Islands",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/vg.png",
      svg: "https://flagcdn.com/vg.svg",
    },
    code: "VG",
  },
  {
    name: "Kenya",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ke.png",
      svg: "https://flagcdn.com/ke.svg",
    },
    code: "KE",
  },
  {
    name: "Niue",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/nu.png",
      svg: "https://flagcdn.com/nu.svg",
    },
    code: "NU",
  },
  {
    name: "Heard Island and McDonald Islands",
    continent: "Antarctica",
    flags: {
      png: "https://flagcdn.com/w320/hm.png",
      svg: "https://flagcdn.com/hm.svg",
    },
    code: "HM",
  },
  {
    name: "Rwanda",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/rw.png",
      svg: "https://flagcdn.com/rw.svg",
    },
    code: "RW",
  },
  {
    name: "Estonia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ee.png",
      svg: "https://flagcdn.com/ee.svg",
    },
    code: "EE",
  },
  {
    name: "Romania",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ro.png",
      svg: "https://flagcdn.com/ro.svg",
    },
    code: "RO",
  },
  {
    name: "Trinidad and Tobago",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/tt.png",
      svg: "https://flagcdn.com/tt.svg",
    },
    code: "TT",
  },
  {
    name: "Guyana",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/gy.png",
      svg: "https://flagcdn.com/gy.svg",
    },
    code: "GY",
  },
  {
    name: "Timor-Leste",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/tl.png",
      svg: "https://flagcdn.com/tl.svg",
    },
    code: "TL",
  },
  {
    name: "Vietnam",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/vn.png",
      svg: "https://flagcdn.com/vn.svg",
    },
    code: "VN",
  },
  {
    name: "Uruguay",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/uy.png",
      svg: "https://flagcdn.com/uy.svg",
    },
    code: "UY",
  },
  {
    name: "Vatican City",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/va.png",
      svg: "https://flagcdn.com/va.svg",
    },
    code: "VA",
  },
  {
    name: "Hong Kong",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/hk.png",
      svg: "https://flagcdn.com/hk.svg",
    },
    code: "HK",
  },
  {
    name: "Austria",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/at.png",
      svg: "https://flagcdn.com/at.svg",
    },
    code: "AT",
  },
  {
    name: "Antigua and Barbuda",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ag.png",
      svg: "https://flagcdn.com/ag.svg",
    },
    code: "AG",
  },
  {
    name: "Turkmenistan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/tm.png",
      svg: "https://flagcdn.com/tm.svg",
    },
    code: "TM",
  },
  {
    name: "Mozambique",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/mz.png",
      svg: "https://flagcdn.com/mz.svg",
    },
    code: "MZ",
  },
  {
    name: "Panama",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/pa.png",
      svg: "https://flagcdn.com/pa.svg",
    },
    code: "PA",
  },
  {
    name: "Micronesia",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/fm.png",
      svg: "https://flagcdn.com/fm.svg",
    },
    code: "FM",
  },
  {
    name: "Ireland",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ie.png",
      svg: "https://flagcdn.com/ie.svg",
    },
    code: "IE",
  },
  {
    name: "Curaçao",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/cw.png",
      svg: "https://flagcdn.com/cw.svg",
    },
    code: "CW",
  },
  {
    name: "French Guiana",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/gf.png",
      svg: "https://flagcdn.com/gf.svg",
    },
    code: "GF",
  },
  {
    name: "Norway",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/no.png",
      svg: "https://flagcdn.com/no.svg",
    },
    code: "NO",
  },
  {
    name: "Åland Islands",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/ax.png",
      svg: "https://flagcdn.com/ax.svg",
    },
    code: "AX",
  },
  {
    name: "Central African Republic",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/cf.png",
      svg: "https://flagcdn.com/cf.svg",
    },
    code: "CF",
  },
  {
    name: "Burkina Faso",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/bf.png",
      svg: "https://flagcdn.com/bf.svg",
    },
    code: "BF",
  },
  {
    name: "Eritrea",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/er.png",
      svg: "https://flagcdn.com/er.svg",
    },
    code: "ER",
  },
  {
    name: "Tanzania",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/tz.png",
      svg: "https://flagcdn.com/tz.svg",
    },
    code: "TZ",
  },
  {
    name: "South Korea",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/kr.png",
      svg: "https://flagcdn.com/kr.svg",
    },
    code: "KR",
  },
  {
    name: "Jordan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/jo.png",
      svg: "https://flagcdn.com/jo.svg",
    },
    code: "JO",
  },
  {
    name: "Mauritania",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/mr.png",
      svg: "https://flagcdn.com/mr.svg",
    },
    code: "MR",
  },
  {
    name: "Lithuania",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/lt.png",
      svg: "https://flagcdn.com/lt.svg",
    },
    code: "LT",
  },
  {
    name: "United States Minor Outlying Islands",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/um.png",
      svg: "https://flagcdn.com/um.svg",
    },
    code: "UM",
  },
  {
    name: "Slovakia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/sk.png",
      svg: "https://flagcdn.com/sk.svg",
    },
    code: "SK",
  },
  {
    name: "Angola",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ao.png",
      svg: "https://flagcdn.com/ao.svg",
    },
    code: "AO",
  },
  {
    name: "Kazakhstan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/kz.png",
      svg: "https://flagcdn.com/kz.svg",
    },
    code: "KZ",
  },
  {
    name: "Moldova",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/md.png",
      svg: "https://flagcdn.com/md.svg",
    },
    code: "MD",
  },
  {
    name: "Mali",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ml.png",
      svg: "https://flagcdn.com/ml.svg",
    },
    code: "ML",
  },
  {
    name: "Falkland Islands",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/fk.png",
      svg: "https://flagcdn.com/fk.svg",
    },
    code: "FK",
  },
  {
    name: "Armenia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/am.png",
      svg: "https://flagcdn.com/am.svg",
    },
    code: "AM",
  },
  {
    name: "Samoa",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/ws.png",
      svg: "https://flagcdn.com/ws.svg",
    },
    code: "WS",
  },
  {
    name: "Jersey",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/je.png",
      svg: "https://flagcdn.com/je.svg",
    },
    code: "JE",
  },
  {
    name: "Japan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/jp.png",
      svg: "https://flagcdn.com/jp.svg",
    },
    code: "JP",
  },
  {
    name: "Bolivia",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/bo.png",
      svg: "https://flagcdn.com/bo.svg",
    },
    code: "BO",
  },
  {
    name: "Chile",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/cl.png",
      svg: "https://flagcdn.com/cl.svg",
    },
    code: "CL",
  },
  {
    name: "United States",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/us.png",
      svg: "https://flagcdn.com/us.svg",
    },
    code: "US",
  },
  {
    name: "Saint Vincent and the Grenadines",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/vc.png",
      svg: "https://flagcdn.com/vc.svg",
    },
    code: "VC",
  },
  {
    name: "Bermuda",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/bm.png",
      svg: "https://flagcdn.com/bm.svg",
    },
    code: "BM",
  },
  {
    name: "Seychelles",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/sc.png",
      svg: "https://flagcdn.com/sc.svg",
    },
    code: "SC",
  },
  {
    name: "British Indian Ocean Territory",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/io.png",
      svg: "https://flagcdn.com/io.svg",
    },
    code: "IO",
  },
  {
    name: "Guatemala",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/gt.png",
      svg: "https://flagcdn.com/gt.svg",
    },
    code: "GT",
  },
  {
    name: "Ecuador",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/ec.png",
      svg: "https://flagcdn.com/ec.svg",
    },
    code: "EC",
  },
  {
    name: "Martinique",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/mq.png",
      svg: "https://flagcdn.com/mq.svg",
    },
    code: "MQ",
  },
  {
    name: "Tajikistan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/tj.png",
      svg: "https://flagcdn.com/tj.svg",
    },
    code: "TJ",
  },
  {
    name: "Malta",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/mt.png",
      svg: "https://flagcdn.com/mt.svg",
    },
    code: "MT",
  },
  {
    name: "Gambia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/gm.png",
      svg: "https://flagcdn.com/gm.svg",
    },
    code: "GM",
  },
  {
    name: "Nigeria",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ng.png",
      svg: "https://flagcdn.com/ng.svg",
    },
    code: "NG",
  },
  {
    name: "Bahamas",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/bs.png",
      svg: "https://flagcdn.com/bs.svg",
    },
    code: "BS",
  },
  {
    name: "Kosovo",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/xk.png",
      svg: "https://flagcdn.com/xk.svg",
    },
    code: "XK",
  },
  {
    name: "Kuwait",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/kw.png",
      svg: "https://flagcdn.com/kw.svg",
    },
    code: "KW",
  },
  {
    name: "Maldives",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/mv.png",
      svg: "https://flagcdn.com/mv.svg",
    },
    code: "MV",
  },
  {
    name: "South Sudan",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/ss.png",
      svg: "https://flagcdn.com/ss.svg",
    },
    code: "SS",
  },
  {
    name: "Iran",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/ir.png",
      svg: "https://flagcdn.com/ir.svg",
    },
    code: "IR",
  },
  {
    name: "Albania",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/al.png",
      svg: "https://flagcdn.com/al.svg",
    },
    code: "AL",
  },
  {
    name: "Brazil",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/br.png",
      svg: "https://flagcdn.com/br.svg",
    },
    code: "BR",
  },
  {
    name: "Serbia",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/rs.png",
      svg: "https://flagcdn.com/rs.svg",
    },
    code: "RS",
  },
  {
    name: "Belize",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/bz.png",
      svg: "https://flagcdn.com/bz.svg",
    },
    code: "BZ",
  },
  {
    name: "Myanmar",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/mm.png",
      svg: "https://flagcdn.com/mm.svg",
    },
    code: "MM",
  },
  {
    name: "Bhutan",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/bt.png",
      svg: "https://flagcdn.com/bt.svg",
    },
    code: "BT",
  },
  {
    name: "Venezuela",
    continent: "South America",
    flags: {
      png: "https://flagcdn.com/w320/ve.png",
      svg: "https://flagcdn.com/ve.svg",
    },
    code: "VE",
  },
  {
    name: "Liberia",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/lr.png",
      svg: "https://flagcdn.com/lr.svg",
    },
    code: "LR",
  },
  {
    name: "Jamaica",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/jm.png",
      svg: "https://flagcdn.com/jm.svg",
    },
    code: "JM",
  },
  {
    name: "Poland",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/pl.png",
      svg: "https://flagcdn.com/pl.svg",
    },
    code: "PL",
  },
  {
    name: "Cayman Islands",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ky.png",
      svg: "https://flagcdn.com/ky.svg",
    },
    code: "KY",
  },
  {
    name: "Brunei",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/bn.png",
      svg: "https://flagcdn.com/bn.svg",
    },
    code: "BN",
  },
  {
    name: "Comoros",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/km.png",
      svg: "https://flagcdn.com/km.svg",
    },
    code: "KM",
  },
  {
    name: "Guam",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/gu.png",
      svg: "https://flagcdn.com/gu.svg",
    },
    code: "GU",
  },
  {
    name: "Tonga",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/to.png",
      svg: "https://flagcdn.com/to.svg",
    },
    code: "TO",
  },
  {
    name: "Kiribati",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/ki.png",
      svg: "https://flagcdn.com/ki.svg",
    },
    code: "KI",
  },
  {
    name: "Ghana",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/gh.png",
      svg: "https://flagcdn.com/gh.svg",
    },
    code: "GH",
  },
  {
    name: "Chad",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/td.png",
      svg: "https://flagcdn.com/td.svg",
    },
    code: "TD",
  },
  {
    name: "Zimbabwe",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/zw.png",
      svg: "https://flagcdn.com/zw.svg",
    },
    code: "ZW",
  },
  {
    name: "Saint Martin",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/mf.png",
      svg: "https://flagcdn.com/mf.svg",
    },
    code: "MF",
  },
  {
    name: "Mongolia",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/mn.png",
      svg: "https://flagcdn.com/mn.svg",
    },
    code: "MN",
  },
  {
    name: "Portugal",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/pt.png",
      svg: "https://flagcdn.com/pt.svg",
    },
    code: "PT",
  },
  {
    name: "American Samoa",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/as.png",
      svg: "https://flagcdn.com/as.svg",
    },
    code: "AS",
  },
  {
    name: "Republic of the Congo",
    continent: "Africa",
    flags: {
      png: "https://flagcdn.com/w320/cg.png",
      svg: "https://flagcdn.com/cg.svg",
    },
    code: "CG",
  },
  {
    name: "Belgium",
    continent: "Europe",
    flags: {
      png: "https://flagcdn.com/w320/be.png",
      svg: "https://flagcdn.com/be.svg",
    },
    code: "BE",
  },
  {
    name: "Israel",
    continent: "Asia",
    flags: {
      png: "https://flagcdn.com/w320/il.png",
      svg: "https://flagcdn.com/il.svg",
    },
    code: "IL",
  },
  {
    name: "New Zealand",
    continent: "Oceania",
    flags: {
      png: "https://flagcdn.com/w320/nz.png",
      svg: "https://flagcdn.com/nz.svg",
    },
    code: "NZ",
  },
  {
    name: "Nicaragua",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ni.png",
      svg: "https://flagcdn.com/ni.svg",
    },
    code: "NI",
  },
  {
    name: "Anguilla",
    continent: "North America",
    flags: {
      png: "https://flagcdn.com/w320/ai.png",
      svg: "https://flagcdn.com/ai.svg",
    },
    code: "AI",
  },
];

type Country = {
  name: string;
  continent: string;
  flags: {
    png: string;
    svg: string;
  };
  code: string;
};

export const countries = new Map<string, Country>();
countriesArray.forEach((country) => countries.set(country.code, country));
