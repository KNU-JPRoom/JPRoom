package com.example.jpsmartcard;

public class JP_RecyclerItem {

    private String Oid;
    private String Name;
    private String Borough;
    private String Status;

    public String getOid() {
        return Oid;
    }

    public void setOid(String oid) {
        Oid = oid;
    }

    public String getName() {
        return Name;
    }

    public String getBorough() {
        return Borough;
    }

    public String getStatus() {
        return Status;
    }

    public void setName(String name) {
        Name = name;
    }

    public void setBorough(String borough) {
        this.Borough = borough;
    }

    public void setStatus(String status) {
        Status = status;
    }
}
