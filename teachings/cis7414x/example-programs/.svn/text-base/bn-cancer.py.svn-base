from SCBayesNet import *;
if __name__ == "__main__":
    print 'starting...';
    bn = SCBayesNet();
    tf_values = ['T', 'F'];

    pollution = bn.node("P", ["L", "H"])
    smoke = bn.node("S", tf_values)
    cancer = bn.node("C", tf_values)
    Xray = bn.node("X", ["P", "N"])
    dyspnoea = bn.node("D", tf_values)

    bn.edge(pollution, cancer)
    bn.edge(smoke, cancer)
    bn.edge(cancer, Xray)
    bn.edge(cancer, dyspnoea)


    pollution.set_cpt({("L"): 0.9, \
                      ("H"): 0.1, \
                      })


    smoke.set_cpt({("T"): 0.3, \
                  ("F"): 0.7, \
                  })


    cancer.set_cpt({("T", "H", "T"): 0.05, \
                   ("F", "H", "T"): 0.95, \
                   ("T", "H", "F"): 0.02, \
                   ("F", "H", "F"): 0.98, \
                   ("T", "L", "T"): 0.03, \
                   ("F", "L", "T"): 0.97, \
                   ("T", "L", "F"): 0.001, \
                   ("F", "L", "F"): 0.999, \
                   })
#    cancer.set_evidence('T');


    Xray.set_cpt({("P", "T"): 0.9, \
                 ("N", "T"): 0.1, \
                 ("P", "F"): 0.2, \
                 ("N", "F"): 0.8, \
                 });


    dyspnoea.set_cpt({("T", "T"): 0.65, \
                     ("F", "T"): 0.35, \
                     ("T", "F"): 0.30, \
                     ("F", "F"): 0.70, \
                     });
    dyspnoea.set_evidence('T');

    bn.print_nodes();
    bn.progress_messages();
    bn.progress_messages();
    bn.progress_messages();
#    bn.print_nodes();
    bn.debug_print();
    print "======="
    bn.print_belief();