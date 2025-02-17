import type { City } from '../types';

import { warsaw } from './cities/warsaw';
import { london } from './cities/london';
import { paris } from './cities/paris';
import { rome } from './cities/rome';
import { barcelona } from './cities/barcelona';
import { berlin } from './cities/berlin';
import { vienna } from './cities/vienna';
import { madrid } from './cities/madrid';
import { prague } from './cities/prague';
import { lisbon } from './cities/lisbon';
import { brussels } from './cities/brussels';
import { krakow } from './cities/krakow';
import { porto } from './cities/porto';
import { seville } from './cities/seville';
import { milan } from './cities/milan';
import { venice } from './cities/venice';
import { amsterdam } from './cities/amsterdam';
import { oslo } from './cities/oslo';
import { copenhagen } from './cities/copenhagen';
import { stockholm } from './cities/stockholm';

/**
 * Collection of all available cities and their tourist information
 * @type {Record<string, City>}
 */
export const cities = {
  warsaw,
  london,
  paris,
  rome,
  barcelona,
  berlin,
  vienna,
  madrid,
  prague,
  lisbon,
  brussels,
  krakow,
  porto,
  seville,
  milan,
  venice,
  amsterdam,
  oslo,
  copenhagen,
  stockholm
} as const;

/**
 * Type representing all available city keys
 */
export type CityKey = keyof typeof cities;
