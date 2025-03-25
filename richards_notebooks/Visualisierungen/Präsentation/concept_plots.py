from graphviz import Digraph

dot = Digraph(format='png')

# Hauptkapitel (Roter Faden)
dot.node('A', 'Teil 1: Die Stadt in der Klimakrise', shape="rect", style="filled", fillcolor="lightgrey")
dot.node('D', 'Teil 2: Hypothesenbildung: \nWelche Faktoren beeinflussen ungleich stark aufgeheizte Stadtteile?', shape="rect", style="filled", fillcolor="lightgrey")
dot.node('I', 'Teil 3: Städtebau: Was wird getan, was können wir tun?', shape="rect", style="filled", fillcolor="lightgrey")
# Unterkapitel
dot.node('B', '''<<TABLE BORDER="0">
<TR><TD><B>Teil 1.1: im Längsschnitt</B></TD></TR>
<TR><TD ALIGN="LEFT">DWD Daten: Zunehmende Erwärmung über die Jahrzehnte hinweg (Seenachtsfest seit 1947).</TD></TR>
</TABLE>>''')

dot.node('C', '''<<TABLE BORDER="0">
<TR><TD><B>Teil 1.2: im Querschnitt</B></TD></TR>
<TR><TD ALIGN="LEFT">12 Messstationen: Innerstädtische Temperaturunterschiede.</TD></TR>
</TABLE>>''')

dot.node('E', '''<<TABLE BORDER="0">
<TR><TD><B>Teil 2.1:</B></TD></TR>
<TR><TD ALIGN="LEFT">Bestimmen der Local Climate Zones für die Stadtteile, in denen wir Messstationen haben.</TD></TR>
</TABLE>>''')

dot.node('F', '''<<TABLE BORDER="0">
<TR><TD><B>Teil 2.2:</B></TD></TR>
<TR><TD ALIGN="LEFT">Satellitendaten: 100m Durchmesser rund um die Messstationen analysieren.</TD></TR>
</TABLE>>''')

dot.node('G', '''<<TABLE BORDER="0">
<TR><TD><B>Teil 2.3:</B></TD></TR>
<TR><TD ALIGN="LEFT">Analyse der Gemeinsamkeiten zwischen den räumlichen Gegebenheiten (Faktoren wie Baumdichte, Nähe zu Wasser, Straßenbelag, Vegetation).</TD></TR>
</TABLE>>''')

dot.node('H', '''<<TABLE BORDER="0">
<TR><TD><B>Teil 2.4:</B></TD></TR>
<TR><TD ALIGN="LEFT">Soziale Ebene: Wer lebt oder arbeitet in den besonders heißen Gebieten? Auswirkungen auf Touristen, Ältere, Kinder.</TD></TR>
</TABLE>>''')


dot.edge('A', 'D', color="red", penwidth="3") 
dot.edge('D', 'I', color='red', penwidth="3") 

dot.edge('A', 'B', color="black", style="dashed")  
dot.edge('A', 'C', color="black", style="dashed")

dot.edge('D', 'E', color="black", style="dashed")
dot.edge('D', 'F', color="black", style="dashed")
dot.edge('D', 'G', color="black", style="dashed")
dot.edge('D', 'H', color="black", style="dashed")

dot.render('roter_faden', view=True)