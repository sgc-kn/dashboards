from graphviz import Digraph

def create_full_graph():
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

    # Verbindungen: Hauptkapitel → Unterkapitel
    dot.edge('A', 'B', color="black", style="dashed")  
    dot.edge('A', 'C', color="black", style="dashed")
    dot.edge('D', 'E', color="black", style="dashed")
    dot.edge('D', 'F', color="black", style="dashed")
    dot.edge('D', 'G', color="black", style="dashed")

    # Der "rote Faden" (Hauptstruktur)
    dot.edge('A', 'D', color="red", penwidth="3") 
    dot.edge('D', 'I', color='red', penwidth="3") 
    
    dot.render('roter_faden', view=True)

def create_subset_graph(name, edges):
    dot = Digraph(name, format='png')
    dot.attr(nodesep="0.1", rankdir="TB")
    nodes = {}

    for edge in edges:
        for node in edge:
            if node not in nodes:
                nodes[node] = get_node_label(node)
                dot.node(node, nodes[node], shape="box", style="filled", fillcolor=get_node_color(node))
        dot.edge(edge[0], edge[1], color="black", style="dashed")

    dot.render(name, view=True)

def get_node_label(node):
    labels = {
        'A': 'Teil 1: Die Stadt in der Klimakrise',
        'B': '<<TABLE BORDER="0"><TR><TD><B>Teil 1.1: im Längsschnitt</B></TD></TR><TR><TD ALIGN="LEFT">DWD Daten: Erwärmung über die Jahrzehnte.</TD></TR></TABLE>>',
        'C': '<<TABLE BORDER="0"><TR><TD><B>Teil 1.2: im Querschnitt</B></TD></TR><TR><TD ALIGN="LEFT">12 Messstationen: Innerstädtische Temperaturunterschiede.</TD></TR></TABLE>>',
        'D': 'Teil 2: Interpretation der Stadtteiltemperaturunterschiede',
        'E': '<<TABLE BORDER="0"><TR><TD><B>Teil 2.1: Local Climate Zones</B></TD></TR><TR><TD ALIGN="LEFT">Analyse der LCZs der Stadtteile mit Messstationen.</TD></TR></TABLE>>',
        'F': '<<TABLE BORDER="0"><TR><TD><B>Teil 2.2: Satellitendaten</B></TD></TR><TR><TD ALIGN="LEFT">100m-Radius um Messstationen.</TD></TR></TABLE>>',
        'G': '<<TABLE BORDER="0"><TR><TD><B>Teil 2.3: Räumliche Faktoren</B></TD></TR><TR><TD ALIGN="LEFT">Baumdichte, Wassernähe, Straßenbelag (..).</TD></TR></TABLE>>'
    }
    return labels.get(node, node)

def get_node_color(node):
    colors = {
        'A': "lightblue", 'B': "lightblue", 'C': "lightblue", 'D': "lightgreen", 'E': "lightgreen", 'F': "lightgreen", 'G': "lightgreen"
    }
    return colors.get(node, "white")

# Hauptgraph
create_full_graph()

# Subsets
create_subset_graph('roter_faden_1_1', [('A', 'B')])
create_subset_graph('roter_faden_1_2', [('A', 'C')])
create_subset_graph('roter_faden_2_1', [('D', 'E')])
create_subset_graph('roter_faden_2_2_3', [('D', 'F'), ('D', 'G')])
