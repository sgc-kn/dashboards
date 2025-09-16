from graphviz import Digraph

dot = Digraph('wide', format='png')

dot.attr(nodesep="0.1", rankdir="TB")  # Top-to-Bottom Layout

# Hauptkapitel (Roter Faden)
dot.node('A', 'Teil 1: Die Stadt in der Klimakrise', shape="box", style="filled", fillcolor="lightblue")
dot.node('D', 'Teil 2: Interpretation der Stadtteiltemperaturunterschiede', shape="box", style="filled", fillcolor="lightgreen")
dot.node('I', 'Teil 3: Maßnahmen der Stadt & Ausblick', shape="box", style="filled", fillcolor="beige")

# Unterkapitel in Subgraphen (Hierarchie erhalten)
with dot.subgraph() as s:
    s.attr(rank='same')  # Alle auf der gleichen Ebene
    s.node('B', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 1.1: im Längsschnitt</B></TD></TR>
    <TR><TD ALIGN="LEFT">DWD Daten: Erwärmung über die Jahrzehnte.</TD></TR>
    </TABLE>>''', style="filled", fillcolor="lightblue")

    s.node('C', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 1.2: im Querschnitt</B></TD></TR>
    <TR><TD ALIGN="LEFT">12 Messstationen: Innerstädtische Temperaturunterschiede.</TD></TR>
    </TABLE>>''', style="filled", fillcolor="lightblue")

with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('E', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 2.1: Local Climate Zones</B></TD></TR>
    <TR><TD ALIGN="LEFT">Analyse der LCZs der Stadtteile mit Messstationen.</TD></TR>
    </TABLE>>''', style="filled", fillcolor="lightgreen")

    s.node('F', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 2.2: Satellitendaten</B></TD></TR>
    <TR><TD ALIGN="LEFT">100m-Radius um Messstationen.</TD></TR>
    </TABLE>>''', style="filled", fillcolor="lightgreen")

    s.node('G', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 2.3: Räumliche Faktoren</B></TD></TR>
    <TR><TD ALIGN="LEFT">Baumdichte, Wassernähe, Straßenbelag (..).</TD></TR>
    </TABLE>>''', style="filled", fillcolor="lightgreen")

    s.node('H', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 2.4: Soziale Ebene</B></TD></TR>
    <TR><TD ALIGN="LEFT">Wer ist betroffen? Touristen, Ältere, Kinder.</TD></TR>
    </TABLE>>''', style="filled", fillcolor="lightgreen")

with dot.subgraph() as s:
    s.attr(rank='same')
    s.node('J', '''<<TABLE BORDER="0">
    <TR><TD><B>Teil 3.1: Trinkwasserbrunnen</B></TD></TR>
    </TABLE>>''', style="filled", fillcolor="beige")
    s.node('K', '''<<TABLE BORDER="0">

    <TR><TD><B>Teil 3.2: Baumkataster</B></TD></TR>
    </TABLE>>''', style="filled", fillcolor="beige")
# Verbindungen: Hauptkapitel → Unterkapitel
dot.edge('A', 'B', color="black", style="dashed")  
dot.edge('A', 'C', color="black", style="dashed")

dot.edge('D', 'E', color="black", style="dashed")
dot.edge('D', 'F', color="black", style="dashed")
dot.edge('D', 'G', color="black", style="dashed")
dot.edge('D', 'H', color="black", style="dashed")

dot.edge('I','J', color= "black", style= "dashed")
dot.edge('I', 'K', color= "black", style= "dashed")

# Der "rote Faden" (Hauptstruktur)
dot.edge('A', 'D', color="red", penwidth="3") 
dot.edge('D', 'I', color='red', penwidth="3") 

dot.render('roter_faden', view=True)
