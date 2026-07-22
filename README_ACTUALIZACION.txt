RCABELLO.COM · ACTUALIZACIÓN LIMPIA DESDE EL ZIP ORIGINAL

Sustituye en GitHub únicamente los archivos incluidos en este paquete y conserva la estructura de carpetas.

Archivos funcionales: 13
Total del paquete, incluyendo este README y la auditoría: 15

Qué se ha hecho

1. Toda la web usa exclusivamente css/main.css y js/app.js.
2. main.css se reconstruyó desde el main-v8.css del ZIP original. Se retiraron las reglas antiguas de los componentes corregidos, se eliminaron declaraciones que quedaban sobrescritas por otras posteriores y se integró el CSS que antes estaba repetido dentro de cada HTML.
3. El icono del menú usa dos líneas HTML reales y ya no depende de elementos que faltaban.
4. El selector de color utiliza un icono CSS estable en Safari móvil.
5. El Atlas ampliado tiene una sola definición responsive y usa la altura real de visualViewport.
6. Los bloques grandes de Ecoalf usan elementos img reales.
7. Las imágenes de Maison Caligari conservan su proporción y no se recortan.
8. Los textos visibles y las traducciones se revisaron para eliminar rayas y construcciones con guion innecesarias.
9. Canonical, Open Graph, robots y sitemap apuntan a https://www.rcabello.com.
10. Se añadieron dimensiones intrínsecas a las imágenes para reducir saltos durante la carga.

Validación incluida

Consulta AUDITORIA_TECNICA.json. La compilación se detuvo automáticamente si encontraba rutas locales rotas, referencias a main-v8.css o app-v8.js, rayas visibles o propiedades contradictorias repetidas dentro del mismo selector y contexto responsive. También se comparó la cascada final con la fuente depurada a 390, 760 y 1440 píxeles. El resultado fue de cero diferencias en las declaraciones calculadas para las páginas y estados probados.

Los archivos css/main-v8.css y js/app-v8.js antiguos pueden permanecer en GitHub porque ninguna página los carga. Puedes borrarlos después para ordenar el repositorio, pero no es necesario para que la web funcione.
