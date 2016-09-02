
function MyPublication(options) {
    this.options = options;
    var self = this;
    this.templates = {};
    this.bibEntries = [];
    this.propertyToKeyValuePairs = function(obj, filterFunc) {
        var keys = Object.keys(obj);
        if (filterFunc) {
            keys = keys.filter(filterFunc);
        }
        return keys.map(function(key, index) {
            return {key: key, value: obj[key]};
        });
    };
    this.groupBy = function(entries, fieldName) {
        var res = entries.reduce(function(result, entry) {
            var fieldValue = entry.Fields[fieldName];
            if (!result[fieldValue]) {
                result[fieldValue] = [];
            }
            result[fieldValue].push(entry);
            return result;
        }, {});
        return res;
    };
    this.postProcessingPubs = function() {
        $(".bibtexDiv").hide();
        $(".bibtexA").click(function() {
            var bibtexDiv = $(this).closest("li").find(".bibtexDiv");
            if (bibtexDiv.is(":visible")) {
                bibtexDiv.hide();
            } else {
                bibtexDiv.show();
            }
            return false;
        });
    };
    this.renderByYear = function() {
        var groupByField = self.groupBy(self.bibEntries, "year");
        groupByField = self.propertyToKeyValuePairs(groupByField)
                .sort(function(a, b) {
                    return -(a.key - b.key);
                });
        var pubsByField = Mustache.render(
                self.byYearTemplate,
                {groupByYear: groupByField},
        {pubItem: self.pubItemTemplte}
        );
        $(this.options.pubDiv).html(pubsByField);
        this.postProcessingPubs();
    };
    this.renderByPubtype = function() {
        var groupByField = self.groupBy(self.bibEntries, "b2h_pubtype");
        var pubsByField = Mustache.render(
                self.byPubTypeTemplate,
                groupByField,
                {pubItem: self.pubItemTemplte}
        );
        $(this.options.pubDiv).html(pubsByField);
        this.postProcessingPubs();
    };
    this.renderByResCat = function() {
        var groupByField = self.groupBy(self.bibEntries, "b2h_rescat");
        var pubsByField = Mustache.render(
                self.byResCatTemplate,
                groupByField,
                {pubItem: self.pubItemTemplte}
        );
        $(this.options.pubDiv).html(pubsByField);
        this.postProcessingPubs();
    };

    this.init = function() {
        $.when($.get("./bibtex/tang-agents.bib"),
                $.get("./bibtex/tang-others.bib"),
                $.get("./templates/publicationByYear.mst"),
                $.get("./templates/publicationByPubType.mst"),
                $.get("./templates/publicationByResCat.mst"),
                $.get("./templates/pubDetails.mst"))
                .done(function(bibtex1,
                        bibtex2,
                        yearTemplate,
                        pubTypeTemplate,
                        resCatTemplate,
                        pubItemTemplate) {
                    self.byYearTemplate = yearTemplate[0];
                    self.byPubTypeTemplate = pubTypeTemplate[0];
                    self.byResCatTemplate = resCatTemplate[0];
                    self.pubItemTemplte = pubItemTemplate[0];

                    var res1 = BibtexParser(bibtex1[0]);
                    var res2 = BibtexParser(bibtex2[0]);
                    var entries = res1.entries.concat(res2.entries);
                    entries.forEach(function(x) {
                        x[x.EntryType] = true;
                        if (x.Fields.author) {
                            x.Fields.author = x.Fields.author.split("and").map(function(x) {
                                return x.trim();
                            });
                            var authors = x.Fields.author;
                            if (authors.length > 1) {
                                x.Fields.authorText = authors.slice(0, authors.length - 1).join(", ") + " and " + authors[authors.length - 1];
                            } else {
                                x.Fields.authorText = authors[0];
                            }
                        }
                        return x;
                    });
                    self.bibEntries = entries
                            .sort(function(a, b) {
                                return -(a.Fields.year - b.Fields.year);
                            });
                    
                    self.renderByYear();
//                    self.renderByPubtype();
//                    self.renderByResCat();
                });
    };
}