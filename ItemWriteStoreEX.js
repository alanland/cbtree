//// Copyright (c) 2010-2012, Peter Jekel// All rights reserved.////  The Checkbox Tree (cbtree), also known as the 'Dijit Tree with Multi State Checkboxes'//  is released under to following three licenses:////  1 - BSD 2-Clause                (http://thejekels.com/js/cbtree/LICENSE)//  2 - The "New" BSD License       (http://trac.dojotoolkit.org/browser/dojo/trunk/LICENSE#L13)//  3 - The Academic Free License   (http://trac.dojotoolkit.org/browser/dojo/trunk/LICENSE#L43)////  In case of doubt, the BSD 2-Clause license takes precedence.//define([	"dojo/_base/array",	"dojo/_base/lang",  "dojo/data/ItemFileWriteStore"], function (array, lang, ItemFileWriteStore){  lang.extend( ItemFileWriteStore, {      addReference: function (/*dojo.data.item*/ refItem, /*dojo.data.item*/ parentItem, /*String*/ attribute) {      // summary:      //    Add an existing item to the parentItem by reference.      // refItem:      //    Item being referenced to be added to the parents list of children.      // parentItem:      //    Parent item.      // attribute:      //    List attribute of the parent to which the refItem it added.      // tag:      //    extension      if (!this.isItem(refItem) || !this.isItem(parentItem)) {        throw new Error( "ItemWriteStoreEX::addReference(): refItem and/or parentItem is not a valid store item");      }      // Prevent recursive referencing..      if (refItem !== parentItem){        var oldValue;        if (parentItem[attribute]){          oldValue = parentItem[attribute];          this._addReferenceToMap( refItem, parentItem, attribute );          parentItem[attribute].push(refItem);        } else {          this._addReferenceToMap( refItem, parentItem, attribute );          parentItem[attribute] = [refItem];        }        // Fire off an event..        this.onSet( parentItem, attribute, oldValue, parentItem[attribute] );        return true;      } else {        throw new Error( "ItemWriteStoreEX::addReference(): parent and reference items are identical" );      }      return false;    },         attachToRoot: function (/*dojo.data.item*/ item) {      // summary:      //    Promote a store item to a top level item.      // item:      //    A valid dojo.data.store item.      // tag:      //    extension      if ( !this.isRootItem(/*dojo.data.item*/ item) ) {        item[this._rootItemPropName] = true;        this._arrayOfTopLevelItems.push(item);        this.onRoot( item,{ attach: true, detach: false } );      }    },    detachFromRoot: function (/*dojo.data.item*/ item) {      // summary:      //    Detach item from the root by removing it from the top level item list      //    and removing its '_rootItemPropName' property.      // item:      //    A valid dojo.data.store item.      // tag:      //    extension      if ( this.isRootItem(item) ) {        this._removeArrayElement(this._arrayOfTopLevelItems, item);        delete item[this._rootItemPropName];        this.onRoot( item,{ attach: false, detach: true } );      }    },        getIdentifierAttr: function() {      // summary:      //    Returns the store identifier attribute is defined.      // tag:      //    extension      if (!this._loadFinished) {        this._forceLoad();      }      return this._getIdentifierAttribute();    },    itemExist: function (/*Object*/ keywordArgs) {      // summary:      //    Tests if, and return a store item if it exists.   This method is based      //    on the same set of prerequisites as newItem(), that is, the store must      //    be full loaded, when the store has an identifier attribute each store      //    item MUST at least have that same attribute and the item can not be      //    pending deletion.      // keywordArgs:      //    Object defining the store item properties.      // tag:      //    extension            var identifierAttr,          itemIdentity,          item;            if (typeof keywordArgs != "object" && typeof keywordArgs != "undefined"){        throw new Error("ItemWriteStoreEX::itemExist(): argument is not an object");      }      this._assert(!this._saveInProgress);      identifierAttr = this.getIdentifierAttr();      if (identifierAttr !== Number && this._itemsByIdentity){        itemIdentity = keywordArgs[identifierAttr]        if (typeof itemIdentity === "undefined"){          throw new Error("ItemWriteStoreEX::itemExist(): item has no identity");        }        if (!this._pending._deletedItems[itemIdentity]) {          item = this._itemsByIdentity[itemIdentity];        } else {          throw new Error("ItemWriteStoreEX::itemExist(): item is being deleted");        }      }      return item;    },        isRootItem: function (/*dojo.data.item*/ item) {      // summary:      //    Returns true if the item has the '_rootItemPropName' property defined      //    and its value is true, otherwise false is returned.      // item:      //    A valid dojo.data.store item.      // tag:      //    extension      this._assertIsItem(item);      return item[this._rootItemPropName] ? item[this._rootItemPropName] : false;     },    onDelete: function(/*dojo.data.item*/ deletedItem){      // summary:      //    See dojo.data.api.Notification.onDelete()      // tag:      //    callback.      // NOTE: Don't call isItem() as it will fail, the item is already deleted      //       and therefore no longer valid.       if ( deletedItem[this._rootItemPropName] === true ){        this.onRoot( deletedItem, { attach: false, detach: true } );      }    },    onNew: function(/*dojo.data.item*/ item, parentInfo ){      // summary:      //    See dojo.data.api.Notification.onNew()      // tag:      //    callback.      if ( this.isRootItem(item) ){        this.onRoot( item,{ attach: true, detach: false } );      }    },        onRoot: function(/*dojo.data.item*/ item, /*Object*/ evt ) {      // summary:      //    Invoked whenever a item is added to, or removed from the root.      // item:      //    Store item.      // evt:      //    Event object with two properties:       //        { attach: /*boolean*/,       //          detach: /*boolean*/       //        }      // tag:      //    callback.    },        removeReference: function ( /*dojo.data.item*/ refItem, /*dojo.data.item*/ parentItem, /*String*/ attribute ){      // summary:      //    Remove a item reference from its parent. Only the references are      //    removed, the refItem itself is not delete.      // refItem:      //    Referenced item to be removed from parents children list.      // parentItem:      //    Parent item.      // attribute:      //    List attribute of the parent from which the refItem it removed.      // tag:      //    extension      if (!this.isItem(refItem) || !this.isItem(parentItem)) {        throw new Error( "ItemWriteStoreEX::removeReference(): refItem and/or parentItem is not a valid store item");      }      if ( parentItem[attribute] ) {        this._removeReferenceFromMap( refItem, parentItem, attribute );        var oldValue = parentItem[attribute];        if (this._removeArrayElement( parentItem[attribute], refItem )) {          // Fire off an event..          if (this._isEmpty(parentItem[attribute])) {            delete parentItem[attribute];          }          this.onSet( parentItem, attribute, oldValue, parentItem[attribute] );          return true;        }      }      return false;    }  }); /* end lang.extend() */  }); /* end define() */