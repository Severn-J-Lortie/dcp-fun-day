function main() 
{
  const cy = cytoscape({
    container: document.getElementById('cy'),
      // initial viewport state:
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  cy.add({
    group: 'nodes',
    data: {
      id: 1
    }
  });
  cy.add({
    group: 'nodes',
    data: {
      id: 2
    }
  });
  cy.add({
    group: 'nodes',
    data: {
      id: 4
    }
  });
  cy.add({
    group: 'edges',
    data: {
      source: 1,
      target: 2
    }
  });
  cy.add({
    group: 'edges',
    data: {
      source: 1,
      target: 4
    }
  });
  const scheduler = cy.$('#4');
  scheduler.select();
  const layout = cy.layout({
    name: 'cose',
    animate: 'end'
  });
  layout.run();
  scheduler.lock();
  setTimeout(() => {
    cy.add({
      group: 'nodes',
      data: {
        id: 9
      }
    });
    cy.add({
      group: 'edges',
      data: {
        source: 4,
        target: 9
      }
    });
    layout.run();
  }, 2000)
}
main();
