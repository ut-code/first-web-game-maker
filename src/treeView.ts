import toTreeView from "./utils/toTreeView";
import htmlTreeData from "./contents/treeData/htmlTreeData";
import cssTreeData from "./contents/treeData/cssTreeData";
import sugorokuTreeData from "./contents/treeData/sugorokuTreeData";
import shogiTreeData from "./contents/treeData/shogiTreeData";

const treeData = [htmlTreeData, cssTreeData, sugorokuTreeData, shogiTreeData];

const treeView = toTreeView(treeData);

export default treeView;
