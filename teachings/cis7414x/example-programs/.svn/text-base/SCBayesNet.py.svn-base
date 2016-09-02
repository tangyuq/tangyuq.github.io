#Message passing for single-connected Bayesian network.
#This program is writen for the demonstration of message passing process.
#It is not tuned for peformance, don't use it in your project assignment.
#Written by Yuqing Tang

#Singly connected Bayes Net node
class SCBNNode:
    def __init__(self, name):
        self.my_id = name;
        self.parents = [];
        self.children = [];
        self.cpt = {};
        self.value_list = [];
        self.pi_message = {};
        self.lambda_message = {};
        self.pi_message_exp = {};
        self.lambda_message_exp = {};
        self.belief = {};
        self.event = None;
    def print_belief(self):
        print self.my_id, ":";
        for k in self.belief:
            print '%s: %.4f' % (k, self.belief[k]);
            
    def print_node(self):
        print '===';
        print 'Name:', self.my_id;
        print 'cpt (size=%d):\n' % (len(self.cpt)), self.cpt;
        print '===';
        
    def debug_print(self):
        print '===';
        print 'Name:', self.my_id;
        print 'parents:';
        for p in self.parents:
            print p.my_id, ',',
        print;

        print 'children:';
        for p in self.children:
            print p.my_id, ',',
        print;
	
        print 'cpt (size=%d):\n' % (len(self.cpt)), self.cpt;
        print 'value_list:\n', self.value_list;

        print 'parent value combinations:';
        for cv in self.parent_combinations():
            print cv;
		
        print 'pi messages:\n', self.pi_message;
        print 'pi messages (exp):\n', self.pi_message_exp;
        print 'lambda messages:\n', self.lambda_message;
        print 'lambda messages (exp):\n', self.lambda_message_exp;
        print '===';


    def add_parent(self, p):
        self.parents.append(p)
    def add_child(self, c):
        self.children.append(c)
    def set_value_list(self, val_list):
        self.value_list = val_list


    #The cpt is in the form of P(myvalue|Parents(..))
    def set_cpt(self, t):
        self.cpt = t
        
    #infer CPT from a parital specified CPT by summing up to 1
    def infer_cpt(self, pt):
        self.cpt = pt;
        for parent_values in self.parent_combinations():
            s = 0;
            for my_value in self.value_list:
                if (parent_values == []):
                    key = my_value;
                else:
                    key = tuple([my_value] + parent_values);
                if key in self.cpt:
                    s += self.cpt[key];
                else:
                    to_fill = key;
            self.cpt[to_fill] = 1 - s;


    def set_evidence(self, value):
        self.event = value;
				

    def parent_combinations(self):
        if (len(self.parents) == 0):
            return [[]];
        parent_combinations = [[]];
        for p in self.parents:
            parent_combinations = [x + [y] for x in parent_combinations for y in p.value_list];
        return parent_combinations;

    #parent value combinations with parent fixed to parent_value
    def fixed_parent_combinations(self, parent, parent_value):
        if (len(self.parents) == 0):
            return [];
        parent_combinations = [[]];
        for p in self.parents:
            if (p != parent):
                parent_combinations = [x + [y] for x in parent_combinations for y in p.value_list];
            else:
                parent_combinations = [x + [parent_value] for x in parent_combinations];
        return parent_combinations;

    #trucate the ending plus of a formula produced to represent the lambdas and pis
    def truncate_ending_plus(self, exp):
        ending_plus = '+ ';
        if (ending_plus == exp[len(exp) - len(ending_plus):len(exp)]):
            exp = exp[0:len(exp) - len(ending_plus)].strip();
        return exp;
    def cpt_exp(self,my_value, parent_values):
        return 'P(%s|%s) ' % (my_value, parent_values);
    def pi_exp(self, parent, parent_value):
        return 'pi_{%s}(%s=%s) ' % (self.my_id, parent.my_id, parent_value);
    def lambda_exp(self, child, my_value):
        return ' lambda_{%s}(%s=%s) ' % (child.my_id, self.my_id, my_value);
    
    #compute a pi message to a child: \pi(myself=v, child=vv)
    def compute_pi(self, child):
        message = {};
        message_exp = {};
        for my_value in self.value_list:
            #handling evident input
            if (self.event != None):
                if (self.event == my_value):
                    message[my_value] = 1;
                else:
                    message[my_value] = 0;
                #no need to do the caluction, so move to the next value
                continue
                
            message[my_value] = 1;
            message_exp[my_value] = '';

            if (len(self.parents) != 0):
                parents_sum = 0;
                parents_sum_exp = '';
                for parent_values in self.parent_combinations():
                    parents_factor = self.cpt[tuple([my_value] + parent_values)];
                    parents_exp = self.cpt_exp(my_value, parent_values);
                    parents_exp += '(';
                    for i in range(0, len(parent_values)):
                        parents_factor *= self.parents[i].pi_message[self][parent_values[i]];
                        parents_exp += self.pi_exp(self.parents[i], parent_values[i]);
                    parents_exp += ')';
                    parents_sum += parents_factor;
                    parents_sum_exp += "(" + parents_exp + ") + ";

                message[my_value] *= parents_sum;
                message_exp[my_value] += '(' + self.truncate_ending_plus(parents_sum_exp) + ')';
            else:
                message[my_value] *= self.cpt[my_value];
                message_exp[my_value] += 'P(%s)' % (my_value);

            for p in [other_child for other_child in self.children if other_child != child]:
                    message[my_value] *= p.lambda_message[self][my_value];
                    message_exp[my_value] += self.lambda_exp(p, my_value);
        #normalize:
        s = 0;
        for my_value in self.value_list:
            s += message[my_value];
        for my_value in self.value_list:
            message[my_value] /= s;
        self.pi_message[child] = message;
        self.pi_message_exp[child] = message_exp;
        print "pi messages in numbers:", message
        print "pi messages in expressions:", message_exp

    #compute a lambda message to a parent: \pi(parent=v)
    def compute_lambda(self, parent):
        message = {};
        message_exp = {};
        for parent_value in parent.value_list:
            my_sum = 0;
            my_sum_exp = '';
            for my_value in self.value_list:
                my_factor_exp = '';
                if (self.event != None):
                    if (self.event == my_value):
                        my_factor = 1;
                    else:
                        my_factor = 0;
                        #no need to multipled with the lambdas of the children and pis of the other parents
                        continue
                else:
                    my_factor = 1;
                if (len(self.parents) != 0):
                    parents_sum = 0;
                    parents_sum_exp = '';
                    for parent_values in self.fixed_parent_combinations(parent, parent_value):
                        parents_factor = self.cpt[tuple([my_value] + parent_values)];
                        parents_factor_exp = self.cpt_exp(my_value, parent_values);
                        for i in range(0, len(parent_values)):
                            if (self.parents[i] != parent):
                                parents_factor *= self.parents[i].pi_message[self][parent_values[i]];
                                parents_factor_exp += self.pi_exp(self.parents[i], parent_values[i]);
                        parents_sum += parents_factor;
                        parents_sum_exp += parents_factor_exp + ' + ';
                    my_factor *= parents_sum;
                    my_factor_exp += '(' + self.truncate_ending_plus(parents_sum_exp) + ')';
                else:
                    my_factor *= self.cpt[my_value];
                    my_factor_exp = 'P(%s)' % (my_value);
                for child in self.children:
                    my_factor *= child.lambda_message[self][my_value];
                    my_factor_exp += self.lambda_exp(child, my_value);
                my_sum += my_factor;
                my_sum_exp += '(' + my_factor_exp + ') + ';
            message[parent_value] = my_sum;
            message_exp[parent_value] = self.truncate_ending_plus(my_sum_exp);
        self.lambda_message[parent] = message;
        self.lambda_message_exp[parent] = message_exp;
        print "lambda messages in numbers:", message;
        print "lambda messages in expressions:", message_exp

    def compute_pis(self):
        for child in self.children:
            if (child not in self.pi_message):
                required_avail = True;
                for other_child in self.children:
                    if (other_child != child and self not in other_child.lambda_message):
                        required_avail = False;
                        break;
                for parent in self.parents:
                    if (self not in parent.pi_message):
                        required_avail = False;
                        break;

                if (required_avail):
                    print 'computing pi from ', self.my_id, ' to ', child.my_id;
                    self.compute_pi(child);

    def compute_lambdas(self):
        for parent in self.parents:
            if (parent not in self.lambda_message):
                required_avail = True;
                for other_parent in self.parents:
                    if (other_parent != parent and self not in other_parent.pi_message):
                        required_avail = False;
                        break;
                for child in self.children:
                    if (self not in child.lambda_message):
                        required_avail = False;
                        break;

                if (required_avail):
                    print 'computing lamda from ', self.my_id, ' to ', parent.my_id;
                    self.compute_lambda(parent);


    def compute_belief(self):
        for my_value in self.value_list:
            if (self.event != None):
                if (self.event == my_value):
                    self.belief[my_value] = 1;
                else:
                    self.belief[my_value] = 0;
                continue

            b = 1;
            if (len(self.parents) != 0):
                parents_sum = 0;
                for parent_values in self.parent_combinations():
                    parents_factor = self.cpt[tuple([my_value] + parent_values)];
                    for i in range(0, len(parent_values)):
                        parents_factor *= self.parents[i].pi_message[self][parent_values[i]];
                    parents_sum += parents_factor;
                b *= parents_sum;
            else:
                b *= self.cpt[my_value];
            
            for child in self.children:
                b *= child.lambda_message[self][my_value];
                            
            self.belief[my_value] = b;
        #normalize:
        print 'belief before normalization:', self.belief;
        s = sum(self.belief.values())
        for val in self.belief:
            self.belief[val] = self.belief[val] / s;
        print 'belief after normalizaiotn:', self.belief;

    def compute_beliefs(self):
        required_avail = True;
        for parent in self.parents:
            if self not in parent.pi_message:
                required_avail = False;
                break;
        for child in self.children:
            if self not in child.lambda_message:
                required_avail = False;
                break;
        if (required_avail and len(self.belief) == 0):
            print 'compute belief of', self.my_id;
            self.compute_belief();

#Singly connected BayesNet
class SCBayesNet:
    def __init__(self):
        self.nodes = [];
        self.edges = [];
    def node(self, name, value_list):
        n = SCBNNode(name);
        n.set_value_list(value_list);
        self.nodes.append(n);
        return n;
    #directed edge
    def BNEdge(self, head, tail):
        head.add_child(tail)
        tail.add_parent(head)
        return (head, tail);

    def edge(self, head, tail):
        e = self.BNEdge(head, tail);
        self.edges.append(e);
        return e;

    #progress the messages for one round
    def progress_messages(self):
        print "===one round of messages===";
        for n in self.nodes:
            n.compute_pis();
            n.compute_lambdas();
            n.compute_beliefs();
        print "===========================";
    def print_belief(self):
        for n in self.nodes:
            n.print_belief();
                
    def debug_print(self):
        for n in self.nodes:
            n.debug_print();

    def print_nodes(self):
        for n in self.nodes:
            n.print_node();


