import { LocalFood } from '../types';

export const localFood: Record<string, LocalFood[]> = {
  warsaw: [
    {
      name: "Zapiekanka",
      type: "snack",
      description: "Polish fast food, created in the 1970s during the Polish People's Republic era. A halved baguette topped with mushrooms, cheese, and various ingredients, served hot."
    },
    {
      name: "Żurek",
      type: "soup",
      description: "Traditional Polish sour rye soup with potatoes, white sausage, and hard-boiled eggs. A hearty and distinctive dish that's considered one of Poland's national foods."
    },
    {
      name: "Pączki",
      type: "dessert",
      description: "Traditional Polish doughnuts filled with rose jam or other sweet fillings, typically eaten on Fat Thursday before Lent begins."
    }
  ],
  paris: [
    {
      name: "Croissant",
      type: "pastry",
      description: "Flaky, buttery pastry that's a symbol of French cuisine. Created in 1683 to celebrate the defeat of the Ottoman Empire at the siege of Vienna."
    },
    {
      name: "Coq au Vin",
      type: "main",
      description: "Classic French dish of chicken braised in wine, lardons, mushrooms, and garlic. Originally a peasant dish that became a staple of French cuisine."
    },
    {
      name: "Macarons",
      type: "dessert",
      description: "Delicate meringue-based sandwich cookies with a ganache, buttercream or jam filling. Created in a Parisian bakery in the early 20th century."
    }
  ],
  rome: [
    {
      name: "Carbonara",
      type: "main",
      description: "Traditional Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper. Created in the mid-20th century and named after coal miners."
    },
    {
      name: "Supplì",
      type: "snack",
      description: "Roman rice balls filled with mozzarella, meat sauce, and sometimes peas, then breaded and fried. A popular street food dating back to the 1800s."
    },
    {
      name: "Cacio e Pepe",
      type: "main",
      description: "Simple yet iconic Roman pasta dish made with black pepper and Pecorino Romano cheese. Originally created by shepherds who carried these non-perishable ingredients."
    }
  ],
  london: [
    {
      name: "Fish and Chips",
      type: "main",
      description: "Iconic British dish of battered fish and thick-cut fried potatoes. First combined in the 1860s and became a working-class staple during the Industrial Revolution."
    },
    {
      name: "Sunday Roast",
      type: "main",
      description: "Traditional British meal of roasted meat, potatoes, vegetables, and Yorkshire pudding. A custom dating back to the 15th century."
    },
    {
      name: "Sticky Toffee Pudding",
      type: "dessert",
      description: "Modern British dessert of moist sponge cake made with dates and covered in toffee sauce. Created in the 1970s in the Lake District."
    }
  ],
  berlin: [
    {
      name: "Currywurst",
      type: "snack",
      description: "Berlin's iconic street food of fried sausage with curry-spiced ketchup. Invented in 1949 by Herta Heuwer using ingredients from British soldiers."
    },
    {
      name: "Döner Kebab",
      type: "main",
      description: "Turkish-German creation of meat carved from a vertical rotisserie, served in bread with vegetables. Popularized in Berlin in the 1970s."
    },
    {
      name: "Berliner Pfannkuchen",
      type: "dessert",
      description: "Traditional Berlin doughnut filled with jam and dusted with sugar. Known simply as 'Berliner' throughout Germany."
    }
  ],
  madrid: [
    {
      name: "Paella",
      type: "main",
      description: "A rice dish originally from Valencia, but popular throughout Spain. It's typically cooked with seafood, meat, and vegetables, and seasoned with saffron."
    },
    {
      name: "Tapas",
      type: "snack",
      description: "A wide variety of small, savory dishes, often served as appetizers or snacks. Tapas are a central part of Spanish cuisine and social life."
    },
    {
      name: "Churros con Chocolate",
      type: "dessert",
      description: "Fried dough pastries, often sprinkled with sugar and served with a thick hot chocolate for dipping. A popular breakfast or snack."
    }
  ],
  barcelona: [
    {
      name: "Paella",
      type: "main",
      description: "While originating in Valencia, Paella is also popular in Barcelona, often with local seafood variations."
    },
    {
      name: "Escalivada",
      type: "snack",
      description: "A traditional Catalan dish of grilled vegetables, such as eggplant, bell peppers, onions, and tomatoes. It can be served as a tapa or a side dish."
    },
    {
      name: "Crema Catalana",
      type: "dessert",
      description: "A Catalan custard dessert similar to crème brûlée, flavored with citrus zest and often topped with caramelized sugar."
    }
  ],
  prague: [
    {
      name: "Svíčková",
      type: "main",
      description: "Tenderloin beef in a creamy vegetable sauce, served with bread dumplings. A classic Czech dish."
    },
    {
      name: "Trdelník",
      type: "dessert",
      description: "A sweet pastry made from grilled dough, coated in sugar and cinnamon. Often sold at street markets."
    },
    {
      name: "Goulash",
      type: "soup/main",
      description: "A hearty meat stew, often seasoned with paprika. While common in many Central European countries, it's also a popular dish in Prague."
    }
  ],
  vienna: [
    {
      name: "Wiener Schnitzel",
      type: "main",
      description: "A thin, breaded and pan-fried cutlet of veal. A quintessential Viennese dish."
    },
    {
      name: "Sachertorte",
      type: "dessert",
      description: "A rich chocolate cake with a thin layer of apricot jam, coated in dark chocolate icing. A famous Viennese dessert."
    },
    {
      name: "Apfelstrudel",
      type: "dessert",
      description: "A strudel filled with apples, cinnamon, and sometimes raisins and nuts. Another iconic Viennese pastry."
    }
  ],
  lisbon: [
    {
      name: "Bacalhau à Brás",
      type: "main",
      description: "A traditional Portuguese dish made with shredded salted cod, onions, and thinly sliced fried potatoes, bound together with scrambled eggs."
    },
    {
      name: "Pastéis de Nata",
      type: "dessert",
      description: "Iconic Portuguese custard tarts with crispy puff pastry and a creamy egg custard filling, dusted with cinnamon. Created by monks in the 18th century."
    },
    {
      name: "Vinho Verde",
      type: "drink",
      description: "A young, slightly sparkling wine unique to Portugal's Minho region. Known for its fresh, crisp taste and lower alcohol content."
    }
  ],
  brussels: [
    {
      name: "Belgian Waffles",
      type: "dessert",
      description: "Light and crispy waffles with deep pockets, traditionally served with powdered sugar, whipped cream, or chocolate. A Belgian street food icon."
    },
    {
      name: "Moules-Frites",
      type: "main",
      description: "Steamed mussels served with crispy Belgian fries. Usually prepared in white wine with herbs and vegetables. A national dish of Belgium."
    },
    {
      name: "Belgian Beer",
      type: "drink",
      description: "Famous Belgian beers ranging from Trappist ales to lambics. Each served in its own specific glass to enhance its unique characteristics."
    }
  ],
  krakow: [
    {
      name: "Pierogi",
      type: "main",
      description: "Traditional Polish dumplings filled with various ingredients like meat, sauerkraut, mushrooms, or cheese and potatoes. A staple of Polish cuisine."
    },
    {
      name: "Obwarzanek",
      type: "snack",
      description: "Ring-shaped bread that's boiled and sprinkled with salt, poppy seeds, or sesame seeds. A symbol of Krakow since the 14th century."
    },
    {
      name: "Żubrówka",
      type: "drink",
      description: "Polish vodka flavored with bison grass, giving it a unique herbaceous taste. Often served with apple juice as a cocktail called 'Tatanka'."
    }
  ],
  porto: [
    {
      name: "Francesinha",
      type: "main",
      description: "A Portuguese sandwich filled with various meats, covered with melted cheese and a spicy tomato-beer sauce. Porto's signature dish."
    },
    {
      name: "Tripas à Moda do Porto",
      type: "main",
      description: "A traditional tripe stew with white beans and various meats. So significant that Porto natives are nicknamed 'tripeiros'."
    },
    {
      name: "Port Wine",
      type: "drink",
      description: "The city's namesake fortified wine, produced in the Douro Valley. Available in various styles from Ruby to Vintage Port."
    }
  ],
  seville: [
    {
      name: "Gazpacho",
      type: "soup",
      description: "A cold soup made from ripe tomatoes, cucumbers, peppers, and garlic. Perfect for Seville's hot summers and a staple of Andalusian cuisine."
    },
    {
      name: "Pescaíto Frito",
      type: "main",
      description: "Various types of fish, lightly battered and fried to perfection. A traditional dish that showcases Seville's seafood heritage."
    },
    {
      name: "Manzanilla",
      type: "drink",
      description: "A variety of fino sherry made in nearby Sanlúcar de Barrameda. Light and dry, perfect with tapas."
    }
  ],
  milan: [
    {
      name: "Risotto alla Milanese",
      type: "main",
      description: "Saffron-flavored risotto that gives it its distinctive yellow color. A symbol of Milanese cuisine dating back to the 16th century."
    },
    {
      name: "Cotoletta alla Milanese",
      type: "main",
      description: "A breaded veal cutlet fried in butter. Similar to Wiener Schnitzel but traditionally served with the bone in."
    },
    {
      name: "Panettone",
      type: "dessert",
      description: "A sweet bread loaf originally from Milan, traditionally eaten during Christmas. Contains candied fruits and raisins."
    }
  ],
  venice: [
    {
      name: "Risotto al Nero di Seppia",
      type: "main",
      description: "Black risotto made with cuttlefish ink. A Venetian specialty that reflects the city's maritime heritage."
    },
    {
      name: "Baccalà Mantecato",
      type: "appetizer",
      description: "Creamed dried cod served on polenta or crostini. A traditional Venetian antipasto that showcases the city's trade history."
    },
    {
      name: "Spritz",
      type: "drink",
      description: "A wine-based cocktail made with Prosecco and Aperol or Campari. Originated in Venice during the Austrian occupation."
    }
  ],
  amsterdam: [
    {
      name: "Stamppot",
      type: "main",
      description: "Traditional Dutch dish of mashed potatoes mixed with vegetables, typically served with meatballs or smoked sausage."
    },
    {
      name: "Stroopwafel",
      type: "dessert",
      description: "Two thin waffles stuck together with a layer of sweet syrup. Created in Gouda but now a beloved treat throughout the Netherlands."
    },
    {
      name: "Jenever",
      type: "drink",
      description: "Traditional Dutch juniper-flavored spirit, predecessor to gin. Served in a traditional tulip-shaped glass filled to the brim."
    }
  ],
  oslo: [
    {
      name: "Lutefisk",
      type: "main",
      description: "Traditional dried whitefish treated with lye, a Norwegian delicacy especially popular during Christmas season."
    },
    {
      name: "Kjøttkaker",
      type: "main",
      description: "Norwegian meatballs served with gravy, potatoes, and lingonberry jam. A comfort food staple in Norwegian homes."
    },
    {
      name: "Aquavit",
      type: "drink",
      description: "Traditional Scandinavian spirit flavored with caraway and other herbs. Often aged in oak barrels and served chilled."
    }
  ],
  copenhagen: [
    {
      name: "Smørrebrød",
      type: "main",
      description: "Open-faced sandwiches on dark rye bread with various toppings like herring, eggs, or liver pâté. A Danish lunch tradition."
    },
    {
      name: "Wienerbrød",
      type: "pastry",
      description: "Danish pastries made with layered, buttery dough and various sweet fillings. Known as 'Danish pastry' internationally, these treats originated in Denmark and are a beloved breakfast and snack item."
    },
    {
      name: "Akvavit",
      type: "drink",
      description: "Traditional Danish spirit flavored with caraway and dill. Often served chilled during traditional Danish meals and celebrations."
    }
  ]
};