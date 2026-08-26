-- ============================================================
-- Seed data — run AFTER 01_schema.sql
-- Fills both checklists with the items already agreed on.
-- Safe to edit before running: change text, drop lines, etc.
-- Everything here can also be edited/added later from the site.
-- ============================================================

insert into tasks (list, category, title, requires_both, sort_order) values
-- VERHUIS — Adreswijziging & officieel
('verhuis','Adreswijziging & officieel','Aangifte adreswijziging bij de gemeente (nieuwe & oude gemeente, binnen 8 werkdagen)', false, 1),
('verhuis','Adreswijziging & officieel','Wijkagent-controle afwachten (adresbevestiging)', false, 2),
('verhuis','Adreswijziging & officieel','Rijbewijs en identiteitskaart (adres wordt automatisch aangepast)', false, 3),
('verhuis','Adreswijziging & officieel','Kentekenbewijs/inschrijving voertuig (DIV) bijwerken', false, 4),
('verhuis','Adreswijziging & officieel','Testament/notariële documenten indien van toepassing', false, 5),

-- VERHUIS — Werk & inkomen (dubbel: Kevin + Melissa)
('verhuis','Werk & inkomen','Adreswijziging doorgeven aan werkgever', true, 10),
('verhuis','Werk & inkomen','Mutualiteit/ziekenfonds adreswijziging', true, 11),
('verhuis','Werk & inkomen','Vakbond (indien lid)', true, 12),
('verhuis','Werk & inkomen','Pensioenfonds/groepsverzekering', true, 13),

-- VERHUIS — Nutsvoorzieningen
('verhuis','Nutsvoorzieningen','Energie (elektriciteit/gas): meterstanden noteren + contract overzetten', false, 20),
('verhuis','Nutsvoorzieningen','Water (Pidpa/De Watergroep)', false, 21),
('verhuis','Nutsvoorzieningen','Internet/TV/telefonie verhuizen of opzeggen', false, 22),
('verhuis','Nutsvoorzieningen','Gas-/elektriciteitskeuring (AREI) indien vereist', false, 23),

-- VERHUIS — Verzekeringen
('verhuis','Verzekeringen','Brandverzekering nieuwe woning + opzeg/overdracht oude woning', false, 30),
('verhuis','Verzekeringen','Familiale verzekering adreswijziging', false, 31),
('verhuis','Verzekeringen','Auto-/omniumverzekering adreswijziging', false, 32),
('verhuis','Verzekeringen','Hospitalisatieverzekering adreswijziging', false, 33),

-- VERHUIS — Financieel
('verhuis','Financieel','Bank: adreswijziging + nieuwe domiciliëringen', false, 40),
('verhuis','Financieel','Hypotheek: adres nieuwe woning correct laten registreren', false, 41),
('verhuis','Financieel','Kadastraal inkomen controleren voor onroerende voorheffing', false, 42),

-- VERHUIS — Post & abonnementen
('verhuis','Post & abonnementen','bpost doorstuurservice aanvragen', false, 50),
('verhuis','Post & abonnementen','Kranten/tijdschriften/streamingdiensten factuuradres', false, 51),
('verhuis','Post & abonnementen','Webshops met opgeslagen adres (Amazon, Bol.com...)', false, 52),
('verhuis','Post & abonnementen','Sportclub/hobby-abonnementen', false, 53),

-- VERHUIS — Gezin/huishouden
('verhuis','Gezin/huishouden','School/kinderopvang adreswijziging', false, 60),
('verhuis','Gezin/huishouden','Dierenarts/chip-registratie huisdier', false, 61),
('verhuis','Gezin/huishouden','Huisarts/tandarts adreswijziging', false, 62),

-- VERHUIS — Rond de sleuteloverdracht
('verhuis','Rond de sleuteloverdracht','Meterstanden EAN-nummers noteren en doorgeven', false, 70),
('verhuis','Rond de sleuteloverdracht','Plaatsbeschrijving intrede laten opmaken', false, 71),
('verhuis','Rond de sleuteloverdracht','Sleuteloverdracht en codes (alarm, garagepoort, brievenbus)', false, 72),
('verhuis','Rond de sleuteloverdracht','Oude woning: eindafrekening + opzeg brandverzekering na overdracht', false, 73),

-- VERBOUWING — Schilderwerken & afwerking muren
('verbouwing','Schilderwerken & afwerking muren','Behang verwijderen', false, 1),
('verbouwing','Schilderwerken & afwerking muren','Schilderen woonkamer', false, 2),
('verbouwing','Schilderwerken & afwerking muren','Schilderen keuken', false, 3),
('verbouwing','Schilderwerken & afwerking muren','Schilderen gang beneden', false, 4),
('verbouwing','Schilderwerken & afwerking muren','Schilderen gang boven', false, 5),
('verbouwing','Schilderwerken & afwerking muren','Schilderen waskamer', false, 6),
('verbouwing','Schilderwerken & afwerking muren','Schilderen bureau', false, 7),

-- VERBOUWING — Plafond
('verbouwing','Plafond','Opschuren plafond', false, 10),
('verbouwing','Plafond','Schilderen plafond', false, 11),

-- VERBOUWING — Vloeren
('verbouwing','Vloeren','Opschuren parket', false, 20),
('verbouwing','Vloeren','Plaatsen van vloer bureau', false, 21),

-- VERBOUWING — Elektriciteit
('verbouwing','Elektriciteit','Elektriciteit (nazicht/aanpassing conform AREI-keuring)', false, 30),

-- VERBOUWING — Netwerk
('verbouwing','Netwerk','Netwerkkabels bekijken en indien nodig trekken', false, 35),

-- VERBOUWING — Structureel
('verbouwing','Structureel','Deur dichtmaken', false, 40),

-- VERBOUWING — Badkamer
('verbouwing','Badkamer','Badkamer renoveren', false, 50),

-- VERBOUWING — Afwerking
('verbouwing','Afwerking','Tv ophangen', false, 60);
