from SCBayesNet import *;


if __name__ == "__main__":
    print 'starting...';
    bn = SCBayesNet();

    tf_values = ['T', 'F'];
    b = bn.node("B", tf_values);
    e = bn.node("E", tf_values)
    a = bn.node("A", tf_values)
    p = bn.node("P", tf_values)
    j = bn.node("J", tf_values)
    m = bn.node("M", tf_values)

    bn.edge(b, a)
    bn.edge(e, a)
    bn.edge(p, j)
    bn.edge(a, j)
    bn.edge(a, m)

    b.infer_cpt({ ('T'): 0.01} );
    e.infer_cpt({ ('T'): 0.02});
    a.infer_cpt({ ('T', 'T', 'T'): 0.95, \
                  ('T', 'T', 'F'): 0.94, \
                  ('T', 'F', 'T'): 0.29, \
                  ('T', 'F', 'F'): 0.001, \
          });
    p.infer_cpt({('T'): 0.05});
    j.infer_cpt({ ('T', 'T', 'T'): 0.95, \
                  ('T', 'T', 'F'): 0.50, \
                  ('T', 'F', 'T'): 0.90, \
                  ('T', 'F', 'F'): 0.01, \
          });
    m.infer_cpt({('T', 'T'): 0.70, ('T', 'F'): 0.01});

    m.set_evidence('T');
    e.set_evidence('T');

#    bn.debug_print();
#	bn.init();
    bn.progress_messages();
    bn.progress_messages();
    bn.progress_messages();
    bn.debug_print();
    print "======="
    bn.print_belief();